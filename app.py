from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import mysql.connector
import os
import subprocess
import json
from werkzeug.routing import BaseConverter


def json_loads_filter(value):
    return json.loads(value)


class ListConverter(BaseConverter):
    def to_python(self, value):
        return [int(x) for x in value.split(",")]

    def to_url(self, value):
        return ",".join(str(x) for x in value)


app = Flask(__name__)
app.jinja_env.filters["loads"] = json_loads_filter
app.url_map.converters["list"] = ListConverter  # Para receber listas na rota
# !!! Definir uma secret key na .env quand for entregar !!!
# app.secret_key = secrets.token_hex(32)
app.secret_key = "a75f208f9bca54f9131027009f9ec4ba6e8d71955c98450c6d9d37e7c838ca36"


HOST = "0.0.0.0"
PORT = 5000
DB_NAME = "quiz_ds_infor"
CAMINHO_INICIALIZADOR_MYSQL = r"C:\xampp\mysql_start.bat"
TABELAS_PERMITIDAS = {
    "temas": ["nome"],
    "niveis_dificuldade": ["nome", "nivel_dificuldade"],
    "explicacoes_respostas": ["conteudo"],
    "perguntas": ["conteudo", "alternativas", "id_resposta"],
    "perguntas_temas": ["id_pergunta", "id_tema"],
}


caminho_schema_sql = "schema.sql"
caminho_population_sql = "population.sql"

alfabeto_minusculo = [chr(i) for i in range(ord("a"), ord("z") + 1)]
alfabeto_maiusculo = [chr(i) for i in range(ord("A"), ord("Z") + 1)]


# Define o diretório de trabalho como o diretório do arquivo Python
caminho_script = os.path.dirname(os.path.abspath(__file__))
os.chdir(caminho_script)


# ----- Auxiliares -----


def limpar_terminal(aguardar: bool = False):
    """
    Limpa o terminal.
    Se aguardar=True, o terminal só limpa depois do usuário pressionar ENTER.
    """

    if aguardar:
        input("\nPressione ENTER para continuar...")

    # Windows usa "cls", Linux/mac usa "clear"
    os.system("cls" if os.name == "nt" else "clear")


# ----- Banco de Dados -----


def inicializar_mysql():
    print("----- Inicializando o MySQL -----")
    try:
        print(os.name)
        if os.name == "nt" and os.path.exists(CAMINHO_INICIALIZADOR_MYSQL):
            subprocess.Popen(
                [CAMINHO_INICIALIZADOR_MYSQL],
                shell=True,
            )
    except Exception as e:
        print("--- Erro ao iniciar o MySQL ---")
        print(e)


def executar_sql(caminho_sql: str):
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", autocommit=False
    )
    cursor = conexao.cursor()

    with open(caminho_sql, "r", encoding="utf-8") as file:
        linhas = file.readlines()

    comando_atual = []
    dentro_comentario = False

    for num_linha, linha in enumerate(linhas, start=1):
        linha_strip = linha.strip()

        # Detecta início/fim de comentário multilinha
        if linha_strip.startswith("/*"):
            dentro_comentario = True
            continue
        if dentro_comentario:
            if "*/" in linha_strip:
                dentro_comentario = False
            continue

        # Ignora linhas de comentário simples
        if linha_strip.startswith("--") or not linha_strip:
            continue

        # Acumula linha atual
        comando_atual.append(linha)

        # Se encontrou o fim de comando
        if linha_strip.endswith(";"):
            comando_sql = "".join(comando_atual).strip()

            try:
                cursor.execute(comando_sql)
            except Exception as e:
                print(f"\n⚠️ Erro na linha {num_linha}: {e}")
                print(f"Comando problemático:\n{comando_sql}\n")
            comando_atual = []  # limpa o buffer

    conexao.commit()
    cursor.close()
    conexao.close()


def inicializar_banco_de_dados():
    executar_sql(caminho_schema_sql)


def conectar():
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    return conexao


def query(sql, convert_json=False):
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(sql)
    dados = cursor.fetchall()
    conexao.close()

    if convert_json:
        for item in dados:
            for campo in convert_json:
                item[campo] = json.loads(item[campo])

    return dados


# --- Ler/Listar ---
# - Perguntas -
def listar_perguntas():
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT * FROM perguntas")
    perguntas = cursor.fetchall()
    conexao.close()

    # Converte JSONs para dict/list
    for p in perguntas:
        p["conteudo"] = json.loads(p["conteudo"])
        p["alternativas"] = json.loads(p["alternativas"])

    return perguntas


# - ID dos Temas através do ID da Pergunta -
def listar_ids_temas_pelo_id_pergunta(id_pergunta: int):
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            p.id AS id_pergunta,
            t.id AS id_tema
        FROM
            perguntas AS p
        INNER JOIN
            perguntas_temas AS pt ON p.id = pt.id_pergunta
        INNER JOIN
            temas AS t ON pt.id_tema = t.id
        WHERE
            p.id = %s;
    """,
        (id_pergunta,),
    )

    resultados = cursor.fetchall()
    conexao.close()

    lista_ids_temas = {linha["id_tema"] for linha in resultados}

    return lista_ids_temas


# - Nomes dos Temas através do ID da Pergunta -
def listar_nomes_temas_pelo_id_pergunta(id_pergunta: int):
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            p.id AS id_pergunta,
            t.id AS id_tema,
            t.nome AS nome_tema
        FROM
            perguntas AS p
        INNER JOIN
            perguntas_temas AS pt ON p.id = pt.id_pergunta
        INNER JOIN
            temas AS t ON pt.id_tema = t.id
        WHERE
            p.id = %s;
    """,
        (id_pergunta,),
    )

    resultados = cursor.fetchall()
    conexao.close()

    lista_nomes_temas = [linha["nome_tema"] for linha in resultados]

    return lista_nomes_temas


# - Nomes dos Níveis -
def obter_nomes_niveis():
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT id, nome FROM niveis_dificuldade ORDER BY id;")
    resultados = cursor.fetchall()

    cursor.close()
    conexao.close()

    # Monta o dicionário { id: nome }
    return {linha["id"]: linha["nome"] for linha in resultados}


'''
# --- Atualizar ---
def atualizar_livros(id_livro, novo_titulo, novo_autor, novo_ano):
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    sql = """
    UPDATE livros
    SET titulo = %s, autor = %s, ano_publicacao = %s
    WHERE id = %s
    """
    valores = (novo_titulo, novo_autor, novo_ano, id_livro)

    cursor.execute(sql, valores)
    conexao.commit()
    conexao.close()


# --- Excluir ---
def excluir_livro(id_livro):
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("DELETE FROM livros WHERE id = %s", (id_livro,))
    conexao.commit()
    conexao.close()

    print("Livro Excluído com Sucesso!!!")
'''


def popular_db():
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS total FROM perguntas;")
    resultado = cursor.fetchone()
    conexao.close()

    if resultado["total"] == 0:
        print("📥 Populando banco de dados...")
        executar_sql(caminho_population_sql)
    else:
        print("✅ Banco já populado. Nenhuma ação necessária.")


# ----- Rotas -----
# --- Páginas ---
# Ler/Listar
@app.route("/")
def index():
    # Redireciona para a rota quiz
    return redirect(url_for("criar_quiz"))

    # Faz uma requisição por todas as perguntas
    perguntas = listar_perguntas()

    return render_template("index.html", perguntas=perguntas)


# Criar Quiz
@app.route("/criar-quiz.html")
def criar_quiz():
    # Faz uma requisição por todas as perguntas
    perguntas = listar_perguntas()
    # Pega os nomes dos temas e correlaciona com o ID
    nomes_temas = {}
    nomes_niveis = obter_nomes_niveis()
    for pergunta in perguntas:
        id = pergunta["id"]
        nomes_temas[id] = listar_nomes_temas_pelo_id_pergunta(id)

    return render_template(
        "criar-quiz.html",
        perguntas=perguntas,
        nomes_temas=nomes_temas,
        nomes_niveis=nomes_niveis,
    )


# Quiz
@app.route("/quiz.html")
def quiz():
    # Faz uma requisição por todas as perguntas
    perguntas = listar_perguntas()
    # Pega os nomes dos temas e correlaciona com o ID
    nomes_temas = {}
    for pergunta in perguntas:
        id = pergunta["id"]
        nomes_temas[id] = listar_nomes_temas_pelo_id_pergunta(id)
    indicadores_alternativas = alfabeto_minusculo

    return render_template(
        "quiz.html",
        perguntas=perguntas,
        nomes_temas=nomes_temas,
        indicadores_alternativas=indicadores_alternativas,
    )


# Quiz
@app.route("/resultado.html")
def resultado():
    # !!!
    return render_template("resultado.html")


# Adicionar
@app.route("/adicionar.html")
def adicionar_html():

    # ----- Temas -----
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id, nome FROM temas ORDER BY nome")
    temas = cursor.fetchall()
    conexao.close()

    # ----- Níveis -----
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, nome, nivel_dificuldade FROM niveis_dificuldade ORDER BY nivel_dificuldade"
    )
    niveis = cursor.fetchall()
    conexao.close()

    # ----- Explicações -----
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id, conteudo FROM explicacoes_respostas ORDER BY id")
    explicacoes = cursor.fetchall()
    for i in range(len(explicacoes)):
        explicacoes[i]["conteudo"] = json.loads(explicacoes[i]["conteudo"])
    conexao.close()

    # ----- Perguntas com JOINs -----
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT 
            p.id,
            p.conteudo,
            p.alternativas,
            p.id_resposta,
            t.nome AS nome_tema,
            nd.nome AS nome_nivel,
            er.conteudo AS explicacao
        FROM perguntas p
        LEFT JOIN temas t ON p.id_tema = t.id
        LEFT JOIN niveis_dificuldade nd ON p.id_nivel = nd.id
        LEFT JOIN explicacoes_respostas er ON p.id_explicacao = er.id
        ORDER BY p.id
    """
    )
    perguntas = cursor.fetchall()
    conexao.close()

    # Converte JSON → dict/list
    for p in perguntas:
        p["conteudo"] = json.loads(p["conteudo"])
        p["alternativas"] = json.loads(p["alternativas"])

    # ----- Perguntas x Temas -----
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id_pergunta, id_tema FROM perguntas_temas")
    perguntas_temas = cursor.fetchall()
    conexao.close()

    return render_template(
        "adicionar.html",
        temas=temas,
        niveis=niveis,
        explicacoes=explicacoes,
        perguntas=perguntas,
        perguntas_temas=perguntas_temas,
    )


# Atualizar
@app.route("/atualizar.html")
def atualizar_html():

    # Temas
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id, nome FROM temas ORDER BY nome")
    temas = cursor.fetchall()
    conexao.close()

    # Níveis
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, nome, nivel_dificuldade FROM niveis_dificuldade ORDER BY nivel_dificuldade"
    )
    niveis = cursor.fetchall()
    conexao.close()

    # Explicações
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id, conteudo FROM explicacoes_respostas ORDER BY id")
    explicacoes = cursor.fetchall()
    # Converte JSON → dict para permitir acessos como explicacao.conteudo['titulo'] no template
    for i in range(len(explicacoes)):
        explicacoes[i]["conteudo"] = json.loads(explicacoes[i]["conteudo"])
    conexao.close()

    # Perguntas
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT 
            p.id,
            p.conteudo,
            p.alternativas,
            p.id_resposta,
            t.nome AS nome_tema,
            nd.nome AS nome_nivel,
            er.conteudo AS explicacao
        FROM perguntas p
        LEFT JOIN temas t ON p.id_tema = t.id
        LEFT JOIN niveis_dificuldade nd ON p.id_nivel = nd.id
        LEFT JOIN explicacoes_respostas er ON p.id_explicacao = er.id
        ORDER BY p.id
    """
    )
    perguntas = cursor.fetchall()
    conexao.close()

    # Converte JSON
    for p in perguntas:
        p["conteudo"] = json.loads(p["conteudo"])
        p["alternativas"] = json.loads(p["alternativas"])

    # Perguntas x Temas
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id_pergunta, id_tema FROM perguntas_temas")
    perguntas_temas = cursor.fetchall()
    conexao.close()

    return render_template(
        "atualizar.html",
        temas=temas,
        niveis=niveis,
        explicacoes=explicacoes,
        perguntas=perguntas,
        perguntas_temas=perguntas_temas,
    )


# Excluir
@app.route("/excluir.html")
def excluir_html():

    # Temas
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id, nome FROM temas ORDER BY nome")
    temas = cursor.fetchall()
    conexao.close()

    # Níveis
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, nome, nivel_dificuldade FROM niveis_dificuldade ORDER BY nivel_dificuldade"
    )
    niveis = cursor.fetchall()
    conexao.close()

    # Explicações
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id, conteudo FROM explicacoes_respostas ORDER BY id")
    explicacoes = cursor.fetchall()
    conexao.close()

    # Perguntas
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT 
            p.id,
            p.conteudo,
            p.alternativas,
            p.id_resposta,
            t.nome AS nome_tema,
            nd.nome AS nome_nivel,
            er.conteudo AS explicacao
        FROM perguntas p
        LEFT JOIN temas t ON p.id_tema = t.id
        LEFT JOIN niveis_dificuldade nd ON p.id_nivel = nd.id
        LEFT JOIN explicacoes_respostas er ON p.id_explicacao = er.id
        ORDER BY p.id
    """
    )
    perguntas = cursor.fetchall()
    conexao.close()

    # Converte JSON
    for p in perguntas:
        p["conteudo"] = json.loads(p["conteudo"])
        p["alternativas"] = json.loads(p["alternativas"])

    # Tabela intermediária
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id_pergunta, id_tema FROM perguntas_temas")
    perguntas_temas = cursor.fetchall()
    conexao.close()

    nomes_temas = {}
    for pergunta in perguntas:
        id = pergunta["id"]
        nomes_temas[id] = listar_nomes_temas_pelo_id_pergunta(id)

    return render_template(
        "excluir.html",
        temas=temas,
        niveis=niveis,
        explicacoes=explicacoes,
        perguntas=perguntas,
        perguntas_temas=perguntas_temas,
        nomes_temas=nomes_temas,
    )


'''
# Criar
@app.route("/adicionar.html")
def adicionar_html():

    # Faz uma requisição por todos os bimestres
    bimestres = query_db(
        """
        SELECT 
            bimestres.id_bimestre, 
            bimestres.nome
        FROM bimestres
        ORDER BY bimestres.nome;"""
    )

    # Faz uma requisição por todas as disciplinas
    disciplinas = query_db(
        """
        SELECT 
            disciplinas.id_disciplina, 
            disciplinas.nome
        FROM disciplinas
        ORDER BY disciplinas.nome;"""
    )

    # Faz uma requisição por todas as salas
    salas = query_db(
        """
        SELECT 
            salas.id_sala, 
            salas.nome
        FROM salas
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todas as notas
    notas = query_db(
        """
        SELECT 
            notas.id_nota, 
            notas.valor, 
            -- Cria aliases
            alunos.nome AS nome_aluno,
            disciplinas.nome AS nome_disciplina,
            bimestres.nome AS nome_bimestre
        FROM notas
        -- Une notas.id_aluno, notas.id_disciplina e notas.id_bimestre
        JOIN alunos ON notas.id_aluno = alunos.id_aluno
        JOIN disciplinas ON notas.id_disciplina = disciplinas.id_disciplina
        JOIN bimestres ON notas.id_bimestre = bimestres.id_bimestre
        ORDER BY notas.id_nota;"""
    )

    return render_template(
        "adicionar.html",
        bimestres=bimestres,
        disciplinas=disciplinas,
        salas=salas,
        notas=notas,
    )


# Excluir
@app.route("/excluir.html")
def excluir_html():
    # Faz uma requisição por todos os bimestres
    bimestres = query_db(
        """
        SELECT 
            bimestres.id_bimestre, 
            bimestres.nome
        FROM bimestres
        ORDER BY bimestres.nome;"""
    )

    # Faz uma requisição por todas as disciplinas
    disciplinas = query_db(
        """
        SELECT 
            disciplinas.id_disciplina, 
            disciplinas.nome
        FROM disciplinas
        ORDER BY disciplinas.nome;"""
    )

    # Faz uma requisição por todas as salas
    salas = query_db(
        """
        SELECT 
            salas.id_sala, 
            salas.nome
        FROM salas
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todos os alunos
    alunos = query_db(
        """
        SELECT 
            alunos.id_aluno, 
            alunos.nome, 
            salas.nome AS nome_sala -- Cria um alias
        FROM alunos
        -- Une alunos.id_sala a salas.id_sala
        JOIN salas ON alunos.id_sala = salas.id_sala
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todas as notas
    notas = query_db(
        """
        SELECT 
            notas.id_nota, 
            notas.valor, 
            -- Cria aliases
            alunos.nome AS nome_aluno,
            disciplinas.nome AS nome_disciplina,
            bimestres.nome AS nome_bimestre
        FROM notas
        -- Une notas.id_aluno, notas.id_disciplina e notas.id_bimestre
        JOIN alunos ON notas.id_aluno = alunos.id_aluno
        JOIN disciplinas ON notas.id_disciplina = disciplinas.id_disciplina
        JOIN bimestres ON notas.id_bimestre = bimestres.id_bimestre
        ORDER BY alunos.nome;"""
    )

    return render_template(
        "excluir.html",
        bimestres=bimestres,
        disciplinas=disciplinas,
        salas=salas,
        alunos=alunos,
        notas=notas,
    )


# Atualizar
@app.route("/atualizar.html")
def atualizar_html():

    # Faz uma requisição por todos os bimestres
    bimestres = query_db(
        """
        SELECT 
            bimestres.id_bimestre, 
            bimestres.nome
        FROM bimestres
        ORDER BY bimestres.nome;"""
    )

    # Faz uma requisição por todas as disciplinas
    disciplinas = query_db(
        """
        SELECT 
            disciplinas.id_disciplina, 
            disciplinas.nome
        FROM disciplinas
        ORDER BY disciplinas.nome;"""
    )

    # Faz uma requisição por todas as salas
    salas = query_db(
        """
        SELECT 
            salas.id_sala, 
            salas.nome
        FROM salas
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todos os alunos
    alunos = query_db(
        """
        SELECT 
            alunos.id_aluno, 
            alunos.nome, 
            salas.nome AS nome_sala -- Cria um alias
        FROM alunos
        -- Une alunos.id_sala a salas.id_sala
        JOIN salas ON alunos.id_sala = salas.id_sala
        ORDER BY salas.nome;"""
    )

    # Faz uma requisição por todas as notas
    notas = query_db(
        """
        SELECT 
            notas.id_nota, 
            notas.valor, 
            -- Cria aliases
            alunos.nome AS nome_aluno,
            disciplinas.nome AS nome_disciplina,
            bimestres.nome AS nome_bimestre
        FROM notas
        -- Une notas.id_aluno, notas.id_disciplina e notas.id_bimestre
        JOIN alunos ON notas.id_aluno = alunos.id_aluno
        JOIN disciplinas ON notas.id_disciplina = disciplinas.id_disciplina
        JOIN bimestres ON notas.id_bimestre = bimestres.id_bimestre
        ORDER BY alunos.nome;"""
    )

    return render_template(
        "atualizar.html",
        bimestres=bimestres,
        disciplinas=disciplinas,
        salas=salas,
        alunos=alunos,
        notas=notas,
    )
'''


# --- API ---
# - CRUD -
# Adicionar dado
@app.route("/api/adicionar", methods=["POST"])
def adicionar_item():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"sucesso": False, "mensagem": "JSON inválido."}), 400

        nome_tabela = data.get("tabela")
        valores = data.get("valores")

        # --- validações ---
        if nome_tabela not in TABELAS_PERMITIDAS:
            return (
                jsonify(
                    {
                        "sucesso": False,
                        "mensagem": f"Inserção não permitida na tabela '{nome_tabela}'.",
                    }
                ),
                403,
            )

        if not valores or not isinstance(valores, dict):
            return (
                jsonify(
                    {"sucesso": False, "mensagem": "Valores inválidos ou ausentes."}
                ),
                400,
            )

        # verifica colunas obrigatórias
        obrigatorias = TABELAS_PERMITIDAS[nome_tabela]
        for col in obrigatorias:
            if col not in valores:
                return (
                    jsonify(
                        {
                            "sucesso": False,
                            "mensagem": f"Coluna obrigatória '{col}' ausente.",
                        }
                    ),
                    400,
                )

        # ----- Preparar dados -----
        colunas = ", ".join(valores.keys())
        placeholders = ", ".join(["%s"] * len(valores))

        sql = f"INSERT INTO {nome_tabela} ({colunas}) VALUES ({placeholders})"

        # converter valores JSON para string (em caso de objetos)
        valores_final = []
        for v in valores.values():
            if isinstance(v, (dict, list)):
                valores_final.append(json.dumps(v, ensure_ascii=False))
            else:
                valores_final.append(v)

        # ----- Executar -----
        conexao = conectar()
        cursor = conexao.cursor()
        cursor.execute(sql, valores_final)
        conexao.commit()

        # --- Obtém o id quando existir ---
        novo_id = cursor.lastrowid if cursor.lastrowid != 0 else None

        return (
            jsonify(
                {
                    "sucesso": True,
                    "mensagem": "Item adicionado com sucesso.",
                    "tabela": nome_tabela,
                    "id": novo_id,  # será None em tabelas sem AUTO_INCREMENT
                    "valores": valores,  # opcional, mas útil para relacionamentos compostos
                }
            ),
            201,
        )

    except mysql.connector.Error as e:
        print("Erro MySQL:", e)
        return jsonify({"sucesso": False, "mensagem": f"Erro MySQL: {e}"}), 500

    except Exception as e:
        print("Erro geral:", e)
        return jsonify({"sucesso": False, "mensagem": f"Erro interno: {e}"}), 500


# Excluir dado
@app.route("/api/excluir", methods=["POST"])
def excluir_item():
    try:
        data = request.get_json()
        if not data:
            return (
                jsonify({"sucesso": False, "mensagem": "Requisição JSON inválida."}),
                400,
            )

        nome_tabela = data.get("tabela")
        condicao = data.get(
            "condicao"
        )  # Ex: "id = %s" ou "id_pergunta = %s AND id_tema = %s"
        condicao_valores = tuple(
            data.get("params", [])
        )  # Ex: [3] → (3,) | [12,3] → (12,3)

        # --- Validação da Tabela ---
        if not nome_tabela or nome_tabela not in TABELAS_PERMITIDAS:
            return (
                jsonify(
                    {
                        "sucesso": False,
                        "mensagem": f"Tabela não permitida: {nome_tabela}.",
                    }
                ),
                403,
            )

        # --- Validação da Condição ---
        if not condicao or not condicao_valores:
            return (
                jsonify(
                    {"sucesso": False, "mensagem": "Condição inválida para exclusão."}
                ),
                400,
            )

        # --- Execução no MySQL ---
        conexao = conectar()
        cursor = conexao.cursor()

        query = f"DELETE FROM {nome_tabela} WHERE {condicao}"
        cursor.execute(query, condicao_valores)
        conexao.commit()

        linhas_afetadas = cursor.rowcount

        return (
            jsonify(
                {
                    "sucesso": True,
                    "mensagem": "Item excluído com sucesso.",
                    "tabela": nome_tabela,
                    "condicao": condicao,
                    "params": condicao_valores,
                    "linhas_excluidas": linhas_afetadas,
                }
            ),
            200,
        )

    except mysql.connector.Error as e:
        try:
            conexao.rollback()
        except:
            pass

        return jsonify({"sucesso": False, "mensagem": f"Erro no banco: {e}"}), 500

    except Exception as e:
        return jsonify({"sucesso": False, "mensagem": f"Erro interno: {e}"}), 500


# - Perguntas para o Quiz -
# Pega todas as perguntas
@app.route("/api/perguntas", methods=["GET"])
def obter_pergunta():
    id = request.args.get("id")

    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM perguntas WHERE perguntas.id = %s", (id,))

    pergunta = cursor.fetchall()
    conexao.close()

    return pergunta


# Pega determinadas perguntas de acordo com uma lista
@app.route("/api/perguntas_especificas/<list:perguntas_ids>", methods=["GET"])
def obter_perguntas_especificas(perguntas_ids):
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)

    placeholders = ", ".join(["%s"] * len(perguntas_ids))
    query = "SELECT * FROM perguntas WHERE id IN ({})".format(placeholders)

    # Executa a query passando a lista como tupla
    cursor.execute(query, tuple(perguntas_ids))

    respostas = cursor.fetchall()

    cursor.close()
    conexao.close()

    # Retorna a lista de dicionários formatada como uma resposta JSON HTTP
    return jsonify(respostas)


# Passa os dados recebidos do quiz para a página de resultado
@app.route("/api/enviar_respostas_para_resultado", methods=["POST"])
def enviar_respostas_para_resultado():
    # Pegar o JSON corretamente
    dados = request.get_json()
    # Salva na sessão para pegar na página resultado
    session["dados_resultado"] = dados
    # Retorna JSON dizendo para onde redirecionar
    return jsonify({"status": "ok", "redirect": url_for("resultado")})


# Pega os dados salvos na sessão para mostrar na página de resultado
@app.route("/api/resultado_dados", methods=["GET"])
def resultado_dados():
    dados = session.get("dados_resultado", {})
    return jsonify(dados)


# Pega determinadas perguntas de acordo com uma lista
@app.route("/api/explicacao_questao/<int:id_explicacao>", methods=["GET"])
def explicacao_questao(id_explicacao):
    # !!!
    conexao = mysql.connector.connect(
        host="localhost", user="root", password="", database=DB_NAME
    )
    cursor = conexao.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM explicacoes_respostas WHERE explicacoes_respostas.id = %s",
        (id_explicacao,),
    )

    respostas = cursor.fetchall()

    cursor.close()
    conexao.close()

    # Retorna a lista de dicionários formatada como uma resposta JSON HTTP
    return jsonify(respostas)


if __name__ == "__main__":
    # Execução Antes do Servidor
    with app.app_context():
        inicializar_mysql()
        print("----- Inicializando Banco de Dados -----")
        inicializar_banco_de_dados()
        limpar_terminal()
        print("----- Populando Banco de Dados -----")
        popular_db()
        limpar_terminal()
    # Inicia o Servidor
    app.run(host=HOST, port=PORT, debug=True)

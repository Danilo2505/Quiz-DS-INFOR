-- ===========================================
-- POPULAÇÃO INICIAL DO BANCO QUIZ_DS_INFOR
-- ===========================================

-- Seleciona o banco
USE quiz_ds_infor;

-- ===========================================
-- INSERÇÃO DE DADOS INICIAIS
-- ===========================================

-- -------------------------------------------
-- TEMAS
-- -------------------------------------------
INSERT INTO temas (nome)
VALUES
    ('Lógica de Programação'),
    ('Banco de Dados'),
    ('Redes de Computadores'),
    ('Desenvolvimento Web'),
    ('Hardware e Sistemas Operacionais'),
    ('Engenharia de Software'),
    ('Segurança da Informação'),
    ('Internet das Coisas (IoT)')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- -------------------------------------------
-- NÍVEIS DE DIFICULDADE
-- -------------------------------------------
INSERT INTO niveis_dificuldade (nome, nivel_dificuldade)
VALUES
    ('Fácil', 1),
    ('Médio', 2),
    ('Difícil', 3)
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- -------------------------------------------
-- EXPLICAÇÕES DAS RESPOSTAS
-- -------------------------------------------
INSERT INTO explicacoes_respostas (conteudo)
VALUES
    (JSON_OBJECT('titulo','Estrutura condicional','texto','A estrutura condicional "if" permite executar um bloco de código apenas se uma condição for verdadeira.')),
    (JSON_OBJECT('titulo','Chave primária','texto','A chave primária identifica unicamente cada registro em uma tabela, garantindo integridade referencial.')),
    (JSON_OBJECT('titulo','Modelo OSI','texto','O modelo OSI possui 7 camadas que padronizam a comunicação entre sistemas de rede.')),
    (JSON_OBJECT('titulo','Integração entre front-end e banco de dados','texto','O back-end atua como intermediário entre o front-end e o banco de dados.')),
    (JSON_OBJECT('titulo','Ciclo de Desenvolvimento de Software','texto','Organiza as etapas desde a concepção até a manutenção de um sistema.')),
    (JSON_OBJECT('titulo','Firewall','texto','Um firewall controla o tráfego de rede com base em regras de segurança, protegendo sistemas contra acessos indevidos.')),
    (JSON_OBJECT('titulo','Sensores IoT','texto','Sensores permitem que dispositivos IoT coletem dados do ambiente e enviem para sistemas de monitoramento.')),
    (JSON_OBJECT('titulo','Variáveis e Tipos de Dados','texto','Variáveis guardam valores e linguagens possuem tipos específicos como inteiros, textos e booleanos.'));

-- ===========================================
-- PERGUNTAS
-- ===========================================
INSERT INTO perguntas (conteudo, alternativas, id_resposta, id_explicacao, id_tema, id_nivel)
VALUES
    -- 01
    (JSON_OBJECT('pergunta', 'Qual estrutura de controle é usada para decidir entre duas ou mais ações em programação?'),
    JSON_ARRAY('Loop for', 'If-else', 'Switch', 'Função'),
    2, 1, 1, 1),
    -- 02
    (JSON_OBJECT('pergunta', 'Qual é o principal objetivo de uma chave primária em uma tabela de banco de dados?'),
     JSON_ARRAY('Permitir duplicação de registros', 'Aumentar desempenho de consultas', 'Identificar unicamente cada linha', 'Controlar permissões de acesso'),
     3, 2, 2, 2),
    -- 03
    (JSON_OBJECT('pergunta', 'Quantas camadas existem no modelo OSI de redes?'),
     JSON_ARRAY('3', '5', '7', '9'),
     3, 3, 3, 1),
    -- 04
    (JSON_OBJECT('pergunta', 'Qual tecnologia conecta o front-end ao banco de dados em uma aplicação web completa?'),
     JSON_ARRAY('CSS', 'JavaScript', 'Back-end', 'HTML'),
     3, 4, 4, 2),
    -- 05
    (JSON_OBJECT('pergunta', 'O que representa o ciclo de vida de software?'),
     JSON_ARRAY('Fases do desenvolvimento de um sistema', 'Lista de requisitos', 'Modelo de banco de dados', 'Documentação opcional'),
     1, 5, 6, 2),
    -- 06
    (JSON_OBJECT('pergunta', 'Qual dispositivo é responsável por filtrar tráfego entre redes?'),
     JSON_ARRAY('Switch', 'Firewall', 'Repetidor', 'Hub'),
     2, 6, 7, 1),
    -- 07
    (JSON_OBJECT('pergunta', 'Qual é a função principal de um sensor em um dispositivo IoT?'),
     JSON_ARRAY('Executar comandos remotos', 'Armazenar código', 'Coletar dados ambientais', 'Gerenciar energia'),
     3, 7, 8, 1),
    -- 08
    (JSON_OBJECT('pergunta', 'Qual tipo de dado é usado para valores verdadeiros ou falsos?'),
     JSON_ARRAY('String', 'Float', 'Boolean', 'Array'),
     3, 8, 1, 1),
    -- 09
    (JSON_OBJECT('pergunta', 'Qual comando SQL é usado para atualizar registros?'),
     JSON_ARRAY('INSERT', 'UPDATE', 'ALTER', 'MODIFY'),
     2, 2, 2, 2),
    -- 10
    (JSON_OBJECT('pergunta', 'Qual protocolo é usado para transferência segura de arquivos?'),
     JSON_ARRAY('FTP', 'SFTP', 'SMTP', 'DHCP'),
     2, 6, 3, 3),
    -- 11
    (JSON_OBJECT('pergunta', 'Qual linguagem é mais usada para estilização no desenvolvimento web?'),
     JSON_ARRAY('JavaScript', 'HTML', 'CSS', 'Python'),
     3, 4, 4, 1),
    -- 12
    (JSON_OBJECT('pergunta', 'O que é RAM?'),
     JSON_ARRAY('Memória de armazenamento permanente', 'Memória volátil de acesso aleatório', 'Processador gráfico', 'Tipo de sistema operacional'),
     2, 2, 5, 1),
    -- 13
    (JSON_OBJECT('pergunta','O que é um algoritmo?'),
     JSON_ARRAY('Sequência de passos','Tipo de dado','Banco de dados','Modelo de rede'),
     1, 1, 1, 1),
    -- 14
    (JSON_OBJECT('pergunta','Qual comando repete um bloco até que a condição seja falsa?'),
     JSON_ARRAY('if','while','switch','return'),
     2, 1, 1, 1),
    -- 15
    (JSON_OBJECT('pergunta','Qual cláusula SQL filtra registros?'),
     JSON_ARRAY('WHERE','SELECT','FROM','INSERT'),
     1, 2, 2, 2),
    -- 16
    (JSON_OBJECT('pergunta','O que significa DDL em SQL?'),
     JSON_ARRAY('Data Define Language','Data Definition Language','Data Delete Language','Direct Data Logic'),
     2, 2, 2, 2),
    -- 17
    (JSON_OBJECT('pergunta','Qual camada OSI trata de endereçamento lógico?'),
     JSON_ARRAY('Física','Rede','Aplicação','Sessão'),
     2, 3, 3, 2),
    -- 18
    (JSON_OBJECT('pergunta','O HTTP opera em qual camada?'),
     JSON_ARRAY('Aplicação','Transporte','Enlace','Física'),
     1, 3, 3, 1),
    -- 19
    (JSON_OBJECT('pergunta','CSS é usado para...?'),
     JSON_ARRAY('Estruturar conteúdo','Programar lógica','Estilizar páginas','Criar banco de dados'),
     3, 4, 4, 1),
    -- 20
    (JSON_OBJECT('pergunta','Qual linguagem é executada no navegador?'),
     JSON_ARRAY('Python','JavaScript','C++','SQL'),
     2, 4, 4, 1),
    -- 21
    (JSON_OBJECT('pergunta','Qual peça é responsável pelo processamento do computador?'),
     JSON_ARRAY('HD','Placa-mãe','CPU','Fonte'),
     3, 2, 5, 1),
    -- 22
    (JSON_OBJECT('pergunta','O que significa SSD?'),
     JSON_ARRAY('Secure Storage Device','Solid State Drive','System Data Disk','Storage System Device'),
     2, 2, 5, 1),
    -- 23
    (JSON_OBJECT('pergunta','Qual fase do software define requisitos?'),
     JSON_ARRAY('Implementação','Análise','Teste','Manutenção'),
     2, 5, 6, 1),
    -- 24
    (JSON_OBJECT('pergunta','Scrum utiliza qual artefato?'),
     JSON_ARRAY('Sprints','Tabelas OSI','Chaves estrangerias','Cascata'),
     1, 5, 6, 2),
    -- 25
    (JSON_OBJECT('pergunta','Firewall atua em qual função?'),
     JSON_ARRAY('Proteger rede','Compactar vídeos','Renderizar páginas','Criar bancos'),
     1, 6, 7, 1),
    -- 26
    (JSON_OBJECT('pergunta','O que é phishing?'),
     JSON_ARRAY('Ataque de engenharia social','Tipo de criptografia','Backup em nuvem','Protocolo de rede'),
     1, 6, 7, 2),
    -- 27
    (JSON_OBJECT('pergunta','O que um sensor mede em IoT?'),
     JSON_ARRAY('Código','Dados ambientais','Drivers','Programas'),
     2, 7, 8, 1),
    -- 28
    (JSON_OBJECT('pergunta','MQTT é um protocolo para...?'),
     JSON_ARRAY('Streaming','Mensageria IoT','E-mail','Transferência FTP'),
     2, 7, 8, 2),
    -- 29
    (JSON_OBJECT('pergunta','Qual tipo representa números inteiros?'),
     JSON_ARRAY('String','Boolean','Integer','Array'),
     3, 8, 1, 1),
    -- 30
    (JSON_OBJECT('pergunta','Qual operador compara igualdade em JS?'),
     JSON_ARRAY('=','==','===','=>'),
     3, 8, 1, 2),
    -- 31
    (JSON_OBJECT('pergunta','O SQL SELECT faz...?'),
     JSON_ARRAY('Insere','Atualiza','Remove','Consulta'),
     4, 2, 2, 1),
    -- 32
    (JSON_OBJECT('pergunta','JOIN junta dados usando...?'),
     JSON_ARRAY('Chave primária','Relacionamento entre tabelas','Drivers','Servidores'),
     2, 2, 2, 2),
    -- 33
    (JSON_OBJECT('pergunta','TCP garante...?'),
     JSON_ARRAY('Entrega confiável','Baixa latência','Criptografia','Troca de MAC'),
     1, 3, 3, 2),
    -- 34
    (JSON_OBJECT('pergunta','DNS converte...?'),
     JSON_ARRAY('IP em domínio','Domínio em IP','MAC em domínio','MAC em IP'),
     2, 3, 3, 1),
    -- 35
    (JSON_OBJECT('pergunta','HTML significa...?'),
     JSON_ARRAY('HyperText Markup Language','HighText Machine Link','HyperTool Manage List','Host Transfer Machine Layer'),
     1, 4, 4, 1),
    -- 36
    (JSON_OBJECT('pergunta','API significa...?'),
     JSON_ARRAY('Application Programming Interface','Advanced Program Instruction','Array Process Integer','Application Public Input'),
     1, 4, 4, 2),
    -- 37
    (JSON_OBJECT('pergunta','BIOS significa...?'),
     JSON_ARRAY('Basic Input Output System','Binary Internal Output Storage','Basic Internal Operational Set','Boot Integrated Output System'),
     1, 2, 5, 1),
    -- 38
    (JSON_OBJECT('pergunta','Processador com mais núcleos…'),
     JSON_ARRAY('É sempre mais lento','Permite paralelismo','Nunca esquenta','Dispensa memória'),
     2, 2, 5, 2),
    -- 39
    (JSON_OBJECT('pergunta','O que é versionamento?'),
     JSON_ARRAY('Salvar arquivos','Controlar mudanças','Criar backups','Armazenar logs'),
     2, 5, 6, 1),
    -- 40
    (JSON_OBJECT('pergunta','Git usa o comando para enviar commits:'),
     JSON_ARRAY('git send','git push','git upload','git deploy'),
     2, 5, 6, 1),
    -- 41
    (JSON_OBJECT('pergunta','Criptografia serve para...?'),
     JSON_ARRAY('Acelerar rede','Ocultar dados','Diminuir armazenamento','Criar programas'),
     2, 6, 7, 1),
    -- 42
    (JSON_OBJECT('pergunta','VPN cria...?'),
     JSON_ARRAY('Rede virtual segura','Rede física','ISP','Proxy reverso'),
     1, 6, 7, 2),
    -- 43
    (JSON_OBJECT('pergunta','IoT depende de...?'),
     JSON_ARRAY('Sensores','Monitores','Drivers','CDs'),
     1, 7, 8, 1),
    -- 44
    (JSON_OBJECT('pergunta','Microcontroladores são…'),
     JSON_ARRAY('Computadores em miniatura','Servidores','Placas gráficas','Drivers de som'),
     1, 7, 8, 2),
    -- 45
    (JSON_OBJECT('pergunta','Boolean pode ser...?'),
     JSON_ARRAY('True/False','Texto','Vetor','Número real'),
     1, 8, 1, 1),
    -- 46
    (JSON_OBJECT('pergunta','Qual operador soma valores em JS?'),
     JSON_ARRAY('/','*','+','%'),
     3, 8, 1, 1),
    -- 47
    (JSON_OBJECT('pergunta','Banco NoSQL guarda dados…'),
     JSON_ARRAY('Linha por linha','Sem esquema rígido','Em tabelas fixas','Somente números'),
     2, 2, 2, 3),
    -- 48
    (JSON_OBJECT('pergunta','Qual comando cria tabela SQL?'),
     JSON_ARRAY('CREATE TABLE','INSERT','UPDATE','NEW TABLE'),
     1, 2, 2, 1),
    -- 49
    (JSON_OBJECT('pergunta','Switch opera em qual camada?'),
     JSON_ARRAY('Rede','Enlace','Aplicação','Física'),
     2, 3, 3, 2),
    -- 50
    (JSON_OBJECT('pergunta','HTTPS adiciona...'),
     JSON_ARRAY('Segurança','Velocidade','MAC Address','DHCP'),
     1, 3, 3, 1),
    -- 51
    (JSON_OBJECT('pergunta','JSON representa...'),
     JSON_ARRAY('Texto estruturado','Imagens','Arquivos binários','Scripts'),
     1, 4, 4, 1),
    -- 52
    (JSON_OBJECT('pergunta','DOM é usado para...?'),
     JSON_ARRAY('Manipular HTML','Criar banco','Compilar programas','Executar Python'),
     1, 4, 4, 2),
    -- 53
    (JSON_OBJECT('pergunta','Fonte ATX alimenta...?'),
     JSON_ARRAY('Rede','Componentes internos','Monitor','Pendrive'),
     2, 2, 5, 1),
    -- 54
    (JSON_OBJECT('pergunta','Overclock aumenta...?'),
     JSON_ARRAY('Frequência da CPU','RAM','HD','Fonte'),
     1, 2, 5, 3),
    -- 55
    (JSON_OBJECT('pergunta','Casos de uso descrevem...?'),
     JSON_ARRAY('Fluxos de interação','Tabelas','Pacotes de rede','Arquivos'),
     1, 5, 6, 2),
    -- 56
    (JSON_OBJECT('pergunta','Kanban usa...?'),
     JSON_ARRAY('Board visual','Sprints','Relatórios SQL','Arquitetura OSI'),
     1, 5, 6, 1),
    -- 57
    (JSON_OBJECT('pergunta','Malware é...?'),
     JSON_ARRAY('Software malicioso','Backup','API','Banco local'),
     1, 6, 7, 1),
    -- 58
    (JSON_OBJECT('pergunta','AES é um tipo de...?'),
     JSON_ARRAY('Criptografia','API','Driver','ORM'),
     1, 6, 7, 2),
    -- 59
    (JSON_OBJECT('pergunta','Arduino é usado em...?'),
     JSON_ARRAY('IoT','Banco de dados','CSS','DNS'),
     1, 7, 8, 1),
    -- 60
    (JSON_OBJECT('pergunta','Edge computing significa...?'),
     JSON_ARRAY('Processar na borda','Criar bordas CSS','Servidor central','Backup externo'),
     1, 7, 8, 3),
    -- 61
    (JSON_OBJECT('pergunta','Operadores de comparação incluem...?'),
     JSON_ARRAY('==','=+','%%','!!'),
     1, 8, 1, 1),
    -- 62
    (JSON_OBJECT('pergunta','Variáveis const não podem...?'),
     JSON_ARRAY('Mudar valor','Ser lidas','Ser usadas','Ser exportadas'),
     1, 8, 1, 2);

-- ===========================================
-- PERGUNTAS_TEMAS
-- ===========================================
INSERT INTO perguntas_temas (id_pergunta, id_tema)
VALUES
    (1,1),(2,2),(3,3),(4,4),(4,2),
    (5,6),(6,7),(7,8),(8,1),(9,2),
    (10,3),(11,4),(12,5),
    (13,1),(14,1),(15,2),(16,2),(17,3),(18,3),
    (19,4),(20,4),(21,5),(22,5),(23,6),(24,6),
    (25,7),(26,7),(27,8),(28,8),
    (29,1),(30,1),(31,2),(32,2),(33,3),(34,3),
    (35,4),(36,4),(37,5),(38,5),(39,6),(40,6),
    (41,7),(42,7),(43,8),(44,8),
    (45,1),(46,1),(47,2),(48,2),(49,3),(50,3),
    (51,4),(52,4),(53,5),(54,5),(55,6),(56,6),
    (57,7),(58,7),(59,8),(60,8),
    (61,1),(62,1)
ON DUPLICATE KEY UPDATE id_tema = VALUES(id_tema);

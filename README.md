# Express template

O Template para APIs em Express é uma estrutura robusta e flexível projetada para acelerar o desenvolvimento de APIs utilizando o framework Express. Este repositório serve como um ponto de partida para desenvolvedores que desejam criar APIs eficientes e bem-estruturadas. O template conta com um script para gerar CRUDs e um sistema de rotas dinâmicas.

## Criando novo repositório

Clique no botão verde "Use this template" e depois clique em "Create a new repository" para criar um novo repositório utilizando este template

## Rodando localmente

Clonando repositório

```bash
  git clone https://repositoryLink.git
```

Entre no diretório do projeto

```bash
  cd express-template
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run dev
```

## Gerar CRUD

Para criar um novo CRUD utilize o seguinte comando:

```bash
  npm run generate crudExample
```

## Rotas dinâmincas

Esse template conta com um sistema de rotas dinâmicas. Para que ele funcione, é necessário que seus arquivos de rotas estejam dentro da pasta "routes" com o nome da rota seguido de ".routes.ts". Assim como no exemplo abaixo:

```bash
  - routes
    - users.routes.ts
```

Se o nome do arquivo for "index", o sistema considerará que esta é a rota "/" da API.

```bash
  - routes
    - index.ts
```

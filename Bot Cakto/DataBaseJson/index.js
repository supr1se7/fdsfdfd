const {
    JsonDatabase,
  } = require("wio.db");
  
const General = new JsonDatabase({
    databasePath: "./DataBaseJson/config.json"
});
const perms = new JsonDatabase({
    databasePath: "./DataBaseJson/Perms.json"
});
const emoji = new JsonDatabase({
    databasePath: "./DataBaseJson/Emojis.json"
});
const produto = new JsonDatabase({
    databasePath: "./DataBaseJson/Produtos.json"
});
const tema = new JsonDatabase({
    databasePath: "./DataBaseJson/Tema.json"
});
const rankproduto = new JsonDatabase({
    databasePath: "./DataBaseJson/RankProduto.json"
});
const saldo = new JsonDatabase({
    databasePath: "./DataBaseJson/Saldo.json"
});
const outros = new JsonDatabase({
    databasePath: "./DataBaseJson/Outros.json"
});
const cupons = new JsonDatabase({
    databasePath: "./DataBaseJson/Cupons.json"
});
const carrinhos = new JsonDatabase({
    databasePath: "./DataBaseJson/Carrinhos.json"
});
const rank = new JsonDatabase({
    databasePath: "./DataBaseJson/Rank.json"
});
const rendimentos = new JsonDatabase({
    databasePath: "./DataBaseJson/Rendimentos.json"
});
const painel = new JsonDatabase({
    databasePath: "./DataBaseJson/Paineis.json"
});
const moder = new JsonDatabase({
    databasePath: "./DataBaseJson/Moderacao.json"
});
    
module.exports = {
   General,
   perms,
   emoji,
   produto,
   tema,
   rankproduto,
   saldo,
   outros,
   cupons,
   carrinhos,
   rank,
   rendimentos,
   painel,
   moder
}
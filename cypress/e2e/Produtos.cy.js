/// <reference types="cypress"/>
describe('teste da funcionalidade produtos', () => {
    let token
before(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn =>{token = tkn})
});

    it('listar produtos', () => {
        cy.request({
            method:'GET',
            url:'http://localhost:3000/produtos',
        }).then((response) =>{
            expect(response.body.produtos[0].nome).to.equal('Iphone XR 4976722749')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(20)
        })
    });
    it('Cadastrar produto', () => {
        let produto =`Iphone XR v2 ${Math.floor(Math.random() * 100000)}`
        cy.request({
            method:'POST',
           url: 'http://localhost:3000/produtos',
            body:{
                "nome": produto,
                "preco": 100,
                "descricao": "telefone",
                "quantidade": 1000
              },
              headers:{authorization: token}  
        })
        
    });
    it('Deve validar mensagen de erro ao cadastrar produto repetido', () => {
       cy.cadastrarProdutos(token, "Iphone XR v2", 250, "descricao do produto", 180)

        .then((response) =>{
expect(response.status).to.equal(400)
expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    });
    it('Deve editar um produto ja cadastrado', () => {
        cy.request('http://localhost:3000/produtos').then(response => {
cy.log(response.body.produtos[0]._id)
let id = (response.body.produtos[0]._id)
cy.request({
method: 'PUT',
url: `http://localhost:3000/produtos/${id}`,
headers: {authorization: token},
body:
{
    "nome": "Iphone XR 4976722749",
    "preco": 100,
    "descricao": "telefone",
    "quantidade": 1000
  }

}).then(response => {
expect(response.body.message).to.equal('Registro alterado com sucesso')

})

        })
        
    });
   it('Deve deletar um produto previamente cadastrado', () => {
    let produto =`Iphone XR v2 ${Math.floor(Math.random() * 100000)}`
    cy.cadastrarProdutos(token,'Iphone XR v2' , 250, "descricao do produto", 180)
    .then(response => {
        let id =response.body._id
        cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/produtos/${id}`,
            headers:{authorization: token}
        }).then(response =>{
            expect(response.body.message).to.equal('Nenhum registro excluído')
            expect(response.status).to.equal(200)

        })
    })
    
   });
});
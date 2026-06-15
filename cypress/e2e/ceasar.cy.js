/// <reference types="cypress" />
context('ceasar', () => {
    beforeEach(() => {
        cy.visit('../../ceasar/index.html');
    });
    it('H1 should have text Caesar Cypher', () => {
        cy.get('h1')
.should('have.text', 'Caesar Cypher');
    });
    it('Automatiser la complétion du formulaire', () => {
    cy.get('#key').clear().type('6');
    cy.get('#message').clear().type('Hello World!');

    cy.get('#key').should('have.value', '6');
    cy.get('#message').should('have.value', 'Hello World!');
  });

  it('Automatiser la validation du formulaire', () => {
    cy.get('#key').clear().type('6');
    cy.get('#message').clear().type('Hello World!');

    cy.get('button[type="submit"]').click();
  });

  it('Vérifier l\'affichage du bon résultat', () => {
    cy.get('#key').clear().type('6');
    cy.get('#message').clear().type('Hello World!');

    cy.get('button[type="submit"]').click();

    cy.get('#output span')
      .should('contain', 'Nkrru Cuxrj!');
  });

})
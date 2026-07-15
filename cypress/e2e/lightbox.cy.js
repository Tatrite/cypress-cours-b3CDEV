// Tests Cypress pour le composant Lightbox

describe('Lightbox - Alpine JS / Tailwind', () => {

  beforeEach(() => {
    // Adapter l'URL selon l'endroit où le fichier est servi
    cy.visit('../../lightbox.html');
  });

    const overlaySelector = '.relative.w-64';
    const overlayLikes = `${overlaySelector} [x-text="likesCount"]`;
    const overlayComments = `${overlaySelector} [x-text="commentsCount()"]`;

    const lightboxBackdrop = '.fixed.top-0.left-0.flex.flex-col';
    const lightboxLikes = '#lightbox [x-text="likesCount"]';
    const likeBtn = 'svg[title="Like"]';
    const dislikeBtn = 'svg[title="Dislike"]';
    const commentInput = '#lightbox input[name="comment"]';
    const publishBtn = '#lightbox button[type="submit"]';
    const commentRows = '#lightbox .flex.items-center.justify-between.py-2.px-4';
    const toggleCommentsLink = '#lightbox [x-text="displayCommentText()"]';
    const deleteIcon = 'svg[title="Supprimer le commentaire"]';

  // 1. Ouverture de la lightbox au clic sur l'image
  it('ouvre la lightbox au clic sur l\'image', () => {
    cy.get(lightboxBackdrop).should('not.be.visible');
    cy.get(`${overlaySelector} img`).click({ force: true });
    cy.get(lightboxBackdrop).should('be.visible');
    cy.get('#lightbox').should('be.visible');
  });
    // 2. Fermeture de la lightbox au clic en dehors
  it('ferme la lightbox au clic en dehors du bloc #lightbox', () => {
    cy.get(`${overlaySelector} img`).click({ force: true });
    cy.get(lightboxBackdrop).should('be.visible');

    // Clic sur le fond, en dehors de #lightbox (coin haut-gauche du backdrop)
    cy.get(lightboxBackdrop).click(5, 5);
    cy.get(lightboxBackdrop).should('not.be.visible');
  });

  // 3. Ajout du like et mise à jour des compteurs (overlay + lightbox)
  it('ajoute un like et met à jour les compteurs overlay et lightbox', () => {
    cy.get(`${overlaySelector} img`).click({ force: true });

    cy.get(likeBtn).click();

    cy.get(lightboxLikes).should('have.text', '1');
    cy.get(dislikeBtn).should('be.visible');
    cy.get(likeBtn).should('not.be.visible');

    // Vérification du compteur affiché dans l'overlay (survol pour l'afficher)
    cy.get(lightboxBackdrop).click(5, 5);
    cy.get(overlaySelector).trigger('mouseover');
    cy.get(overlayLikes).should('have.text', '1');
  });
// 4. Suppression du like et mise à jour des compteurs
  it('retire un like et remet les compteurs à zéro', () => {
    cy.get(`${overlaySelector} img`).click({ force: true });
    cy.get(likeBtn).click();
    cy.get(lightboxLikes).should('have.text', '1');

    cy.get(dislikeBtn).click();

    cy.get(lightboxLikes).should('have.text', '0');
    cy.get(likeBtn).should('be.visible');
    cy.get(dislikeBtn).should('not.be.visible');

    cy.get(lightboxBackdrop).click(5, 5);
    cy.get(overlaySelector).trigger('mouseover');
    cy.get(overlayLikes).should('have.text', '0');
  });
 // 5. Ajout d'un commentaire
  it('ajoute un commentaire "Cypress is awesome!"', () => {
    cy.get(`${overlaySelector} img`).click({ force: true });

    cy.get(commentInput).type('Cypress is awesome!');
    cy.get(publishBtn).should('not.be.disabled').click();

    cy.get(commentRows).should('have.length', 1);
    cy.get(commentRows).first().find('.text-black.text-xs').should('have.text', 'Cypress is awesome!');
    cy.get(commentRows).first().find('.text-gray-500').should('have.text', 'johndoe');

    // Le champ est réinitialisé après publication
    cy.get(commentInput).should('have.value', '');
  });
// 6. Impossibilité de publier un commentaire vide (bouton désactivé)
  it('garde le bouton Publish désactivé tant que le champ est vide', () => {
    cy.get(`${overlaySelector} img`).click({ force: true });

    cy.get(publishBtn).should('be.disabled');

    // Saisie puis effacement : le bouton doit redevenir désactivé
    cy.get(commentInput).type('test');
    cy.get(publishBtn).should('not.be.disabled');

    cy.get(commentInput).clear();
    cy.get(publishBtn).should('be.disabled');
  });
// 7. Masquage des commentaires
  it('permet de masquer/afficher la liste des commentaires', () => {
    cy.get(`${overlaySelector} img`).click({ force: true });
    cy.get(commentInput).type('Premier commentaire');
    cy.get(publishBtn).click();

    // Visible automatiquement après publication
    cy.get('#lightbox .bg-white.flex.flex-col').should('be.visible');

    cy.get(toggleCommentsLink).click();
    cy.get('#lightbox .bg-white.flex.flex-col').should('not.be.visible');

    cy.get(toggleCommentsLink).click();
    cy.get('#lightbox .bg-white.flex.flex-col').should('be.visible');
  });
// 8. Compteurs de commentaires (overlay + lien show/hide dans la lightbox)
  it('met à jour les compteurs de commentaires overlay et lightbox', () => {
    cy.get(`${overlaySelector} img`).click({ force: true });

    cy.get(commentInput).type('Un');
    cy.get(publishBtn).click();
    cy.get(commentInput).type('Deux');
    cy.get(publishBtn).click();

    cy.get(lightboxBackdrop).click(5, 5);
    cy.get(overlaySelector).trigger('mouseover');
    cy.get(overlayComments).should('have.text', '2');

    cy.get(toggleCommentsLink).should('contain.text', '2');
  });

// 9. Singulier / pluriel selon le nombre de commentaires
  it('affiche le singulier ou le pluriel selon le nombre de commentaires', () => {
    cy.get(`${overlaySelector} img`).click({ force: true });

    cy.get(commentInput).type('Un seul commentaire');
    cy.get(publishBtn).click();
    cy.get(toggleCommentsLink).should('have.text', 'Hide 1 comment');

    cy.get(commentInput).type('Un deuxième commentaire');
    cy.get(publishBtn).click();
    cy.get(toggleCommentsLink).should('have.text', 'Hide 2 comments');
  });
// 10. Suppression du bon commentaire parmi trois
  it('supprime le second commentaire parmi trois au clic sur sa croix', () => {
    cy.get(`${overlaySelector} img`).click({ force: true });

    ['Commentaire 1', 'Commentaire 2', 'Commentaire 3'].forEach((texte) => {
      cy.get(commentInput).type(texte);
      cy.get(publishBtn).click();
    });

    cy.get(commentRows).should('have.length', 3);

    // Suppression du second commentaire (index 1)
    cy.get(commentRows).eq(1).find(deleteIcon).click();

    cy.get(commentRows).should('have.length', 2);
    cy.get(commentRows).eq(0).find('.text-black.text-xs').should('have.text', 'Commentaire 1');
    cy.get(commentRows).eq(1).find('.text-black.text-xs').should('have.text', 'Commentaire 3');
  });

});
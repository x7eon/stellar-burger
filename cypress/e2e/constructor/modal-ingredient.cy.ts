describe('проверка модального окна ингредиента', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });

  it('проверка открытия модального окна ингредиента', function () {
    const ingredientElems = cy.get('[data-cy=ingredients-ingredient]');
    ingredientElems.contains('Булка 1').click();

    const modal = cy.get('[data-cy=ingredient-modal]');

    modal.should('be.visible');
    modal.contains('Булка 1').should('exist');
  });

  it('проверка закрытия модального окна ингредиента кликом на кнопку', function () {
    const ingredientElems = cy.get('[data-cy=ingredients-ingredient]');
    ingredientElems.contains('Булка 1').click();
    const modal = cy.get('[data-cy=ingredient-modal]');
    const buttonCloseModal = cy.get('[data-cy=button-modal-close]');
    buttonCloseModal.click();
    modal.should('not.exist');
  });

  it('проверка закрытия модального окна ингредиента кликом по оверлею', function () {
    const ingredientElems = cy.get('[data-cy=ingredients-ingredient]');
    ingredientElems.contains('Булка 1').click();
    const modal = cy.get('[data-cy=ingredient-modal]');
    const modalOverlay = cy.get('[data-cy=modal-overlay]');
    modalOverlay.click({ force: true });
    modal.should('not.exist');
  });
});

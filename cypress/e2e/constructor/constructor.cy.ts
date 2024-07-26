describe('проверка добавления ингридиента в конструктор', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });

  it('проверка добавлении булочки', function () {
    const bunIgredientsElem = cy.get('[data-cy=bun-ingredients]');
    bunIgredientsElem.contains('Добавить').click();

    const constructorBunTop = cy.get('[data-cy=constructor-bun-top]');
    const constructorBunBottom = cy.get('[data-cy=constructor-bun-bottom');
    constructorBunTop.contains('Булка 1').should('exist');
    constructorBunBottom.contains('Булка 1').should('exist');
  });

  it('проверка добавления основного ингрединета', function () {
    const mainsIgredientsElem = cy.get('[data-cy=mains-ingredients]');
    mainsIgredientsElem.contains('Добавить').click();

    const burgerConsturctor = cy.get('[data-cy=constructor-mains]');
    burgerConsturctor.should('contain', 'Ингредиент 1');
  });
});

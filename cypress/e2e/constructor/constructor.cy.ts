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

describe('проверка оформления заказа', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post-order.json' });

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('fake-refreshToken')
    );
    cy.setCookie('accessToken', 'fake-accessToken');
    cy.visit('http://localhost:4000');
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('проверка оформления заказа', function () {
    const bunIgredientsElem = cy.get('[data-cy=bun-ingredients]');
    bunIgredientsElem.contains('Добавить').click();

    const mainsIgredientsElem = cy.get('[data-cy=mains-ingredients]');
    mainsIgredientsElem.contains('Добавить').click();

    const buttonOrder = cy.get('[data-cy=constructor-button-order]');
    buttonOrder.click();

    const orderRequestModal = cy.get('[data-cy=orderRequest-modal]');
    orderRequestModal.should('exist');

    const orderNumber = cy.get('[data-cy=order-number]');
    orderNumber.contains('15').should('exist');

    const modalCloseButton = cy.get('[data-cy=button-modal-close]');
    modalCloseButton.click();
    orderRequestModal.should('not.exist');

    cy.get('[data-cy=constructor-bun-top]').should('not.exist');
    cy.get('[data-cy=constructor-bun-bottom]').should('not.exist');

    cy.get('[data-cy=constructor-mains]')
      .contains('Выберите начинку')
      .should('exist');
  });
});

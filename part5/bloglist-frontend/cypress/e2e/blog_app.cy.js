describe('Blog app', () => {
	beforeEach(() => {
		cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);

		const user1 = {
			name: 'Pshemek',
			username: 'pshemek',
			password: 'sekret',
		};

		const user2 = {
			name: 'Pshemek2',
			username: 'pshemek2',
			password: 'sekret2',
		};

		cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1);
		cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2);

		cy.visit('');
	});

	it('Login form is shown', () => {
		cy.get('.loginForm')
			.should('contain', 'username')
			.and('contain', 'password');
	});

	describe('Login', () => {
		it('succeeds with correct credentials', () => {
			cy.get('#username').type('pshemek');
			cy.get('#password').type('sekret');
			cy.get('.login-button').click();

			cy.get('html').should('contain', 'Pshemek logged in');
		});

		it('fails with wrong credentials', () => {
			cy.get('#username').type('pshemek');
			cy.get('#password').type('wrong');
			cy.get('.login-button').click();

			cy.get('.notification')
				.should('contain', 'wrong username or password')
				.and('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});

	describe('When logged in', () => {
		beforeEach(() => {
			cy.login({ username: 'pshemek', password: 'sekret' });
		});

		it('A blog can be created', () => {
			cy.contains('new note').click();

			cy.get('#title').type('Cypress title');
			cy.get('#author').type('Cypress author');
			cy.get('#url').type('Cypress-url.com');
			cy.get('.create-button').click();

			cy.contains('Cypress title by Cypress author');
		});

		describe('and several blogs exist', () => {
			beforeEach(() => {
				cy.createBlog({
					title: 'New Blog 1',
					author: 'Pshemek',
					url: 'some-url-1',
				});
				cy.createBlog({
					title: 'New Blog 2',
					author: 'Pshemek',
					url: 'some-url-2',
				});
				cy.createBlog({
					title: 'New Blog 3',
					author: 'Pshemek',
					url: 'some-url-3',
				});
			});

			it('user can like a blog', () => {
				cy.contains('view').click();

				cy.contains('likes 0');
				cy.contains('like').click();

				cy.contains('likes 1');
			});

			it('user can delete a blog', () => {
				cy.contains('New Blog 1 by Pshemek').parent().find('button').click();

				cy.contains('remove').click();

				cy.reload();

				cy.get('html').should('not.contain', 'New Blog 1 by Pshemek');
			});

			it('only user who created a blog should see the delete button', () => {
				cy.contains('New Blog 1 by Pshemek').parent().find('button').click();
				cy.contains('remove');

				cy.contains('logout').click();
				cy.login({ username: 'pshemek2', password: 'sekret2' });

				cy.get('.blog').eq(0).find('button').click();
				cy.get('.blog').eq(0).contains('likes');
				cy.get('.blog').eq(0).should('not.contain', 'remove');
			});

			it.only('blogs are sorted in descending order based on number of likes', () => {
				cy.get('.blog').eq(0).should('contain', 'New Blog 1').as('blog1');
				cy.get('.blog').eq(1).should('contain', 'New Blog 2').as('blog2');

				cy.get('@blog2').contains('view').click();
				cy.get('@blog2').contains('like').click();
				cy.get('@blog2').contains('like').click();
				cy.get('@blog2').contains('like').click();
				cy.get('@blog2').contains('like').click();

				cy.wait(2000);
				cy.reload();

				cy.contains('sort blogs').click();
				cy.get('.blog').eq(0).should('contain', 'New Blog 2');
			});
		});
	});
});

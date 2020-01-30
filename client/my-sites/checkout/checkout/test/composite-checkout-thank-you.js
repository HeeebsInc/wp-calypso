/**
 * Internal dependencies
 */
import { getThankYouPageUrl } from '../composite-checkout-thank-you';

// TEMPORARY disabling this rule to commit in-progress work
/* eslint-disable no-undef */

describe( 'getThankYouPageUrl', () => {
	it( 'redirects to the root page when no site is set', () => {
		const url = getThankYouPageUrl();
		expect( url ).toBe( '/' );
	} );

	it( 'redirects to the thank-you page with a purchase id when a site and purchaseId is set', () => {
		const url = getThankYouPageUrl( { siteSlug: 'foo.bar', purchaseId: '1234abcd' } );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd' );
	} );

	it( 'redirects to the thank-you page with a receipt id when a site and transaction receipt_id is set', () => {
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( { siteSlug: 'foo.bar', transaction } );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd' );
	} );

	it( 'redirects to the thank-you pending page with a order id when a site and transaction orderId is set', () => {
		const transaction = {
			step: { data: { orderId: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( { siteSlug: 'foo.bar', transaction } );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/pending/1234abcd' );
	} );

	it( 'redirects to the thank-you page with a placeholder receiptId with a site when the cart is not empty but there is no receipt id', () => {
		const cart = { products: [ { id: 'something' } ] };
		const url = getThankYouPageUrl( { siteSlug: 'foo.bar', cart } );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/:receiptId' );
	} );

	it( 'redirects to the thank-you page with a feature when a site, a purchase id, and a valid feature is set', () => {
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			feature: 'all-free-features',
			purchaseId: '1234abcd',
		} );
		expect( url ).toBe( '/checkout/thank-you/features/all-free-features/foo.bar/1234abcd' );
	} );

	it( 'redirects to the thank-you page with a feature when a site, a receipt id, and a valid feature is set', () => {
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			feature: 'all-free-features',
			transaction,
		} );
		expect( url ).toBe( '/checkout/thank-you/features/all-free-features/foo.bar/1234abcd' );
	} );

	it( 'redirects to the thank-you pending page with a feature when a site, an order id, and a valid feature is set', () => {
		const transaction = {
			step: { data: { orderId: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			feature: 'all-free-features',
			transaction,
		} );
		expect( url ).toBe( '/checkout/thank-you/features/all-free-features/foo.bar/pending/1234abcd' );
	} );

	it( 'redirects to the thank-you page with a feature when a site and a valid feature is set with no receipt but the cart is not empty', () => {
		const cart = { products: [ { id: 'something' } ] };
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			feature: 'all-free-features',
			cart,
		} );
		expect( url ).toBe( '/checkout/thank-you/features/all-free-features/foo.bar/:receiptId' );
	} );

	it( 'redirects to the thank-you page without a feature when a site, a purchase id, and an invalid feature is set', () => {
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			feature: 'fake-key',
			purchaseId: '1234abcd',
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd' );
	} );

	it( 'redirects to the plans page with thank-you query string if there is a non-atomic jetpack product', () => {
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			purchaseId: '1234abcd',
			isJetpackNotAtomic: true,
			product: 'jetpack_backup_daily',
		} );
		expect( url ).toBe( '/plans/my-plan/foo.bar?thank-you=true&product=jetpack_backup_daily' );
	} );

	it( 'redirects to the plans page with thank-you query string and jetpack onboarding if there is a non-atomic jetpack plan', () => {
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			purchaseId: '1234abcd',
			isJetpackNotAtomic: true,
		} );
		expect( url ).toBe( '/plans/my-plan/foo.bar?thank-you=true&install=all' );
	} );

	it( 'redirects to the plans page with thank-you query string and jetpack onboarding if there is a non-atomic jetpack plan even if there is a feature', () => {
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			purchaseId: '1234abcd',
			feature: 'all-free-features',
			isJetpackNotAtomic: true,
		} );
		expect( url ).toBe( '/plans/my-plan/foo.bar?thank-you=true&install=all' );
	} );

	it( 'redirects to internal redirectTo url if set', () => {
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			redirectTo: '/foo/bar',
		} );
		expect( url ).toBe( '/foo/bar' );
	} );

	it( 'redirects to the root url if redirectTo does not start with admin_url for site', () => {
		const adminUrl = 'https://my.site/wp-admin/';
		const redirectTo = 'https://other.site/post.php?post=515';
		const site = { options: { admin_url: adminUrl } };
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			site,
			redirectTo,
		} );
		expect( url ).toBe( '/' );
	} );

	it( 'redirects to external redirectTo url if it starts with admin_url for site', () => {
		const adminUrl = 'https://my.site/wp-admin/';
		const redirectTo = adminUrl + 'post.php?post=515';
		const site = { options: { admin_url: adminUrl } };
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			site,
			redirectTo,
		} );
		expect( url ).toBe( redirectTo + '&action=edit&plan_upgraded=1' );
	} );

	it( 'redirects to manage purchase page if there is a renewal', () => {
		const cart = {
			products: [
				{ extra: { purchaseType: 'renewal', purchaseDomain: 'foo.bar', purchaseId: '123abc' } },
			],
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
		} );
		expect( url ).toBe( '/me/purchases/foo.bar/123abc' );
	} );

	it( 'does not redirect to url from cookie if isEligibleForSignupDestination is false', () => {
		const getUrlFromCookie = jest.fn( () => '/cookie' );
		const cart = {
			products: [ { product_slug: 'foo' } ],
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			getUrlFromCookie,
			isEligibleForSignupDestination: false,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/:receiptId' );
	} );

	it( 'redirects to url from cookie if isEligibleForSignupDestination is set', () => {
		const getUrlFromCookie = jest.fn( () => '/cookie' );
		const cart = {
			products: [ { product_slug: 'foo' } ],
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			getUrlFromCookie,
			isEligibleForSignupDestination: true,
		} );
		expect( url ).toBe( '/cookie' );
	} );

	it( 'redirects to url from cookie if cart is empty and no receipt is set', () => {
		const getUrlFromCookie = jest.fn( () => '/cookie' );
		const cart = {
			products: [],
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			getUrlFromCookie,
			isEligibleForSignupDestination: true,
		} );
		expect( url ).toBe( '/cookie' );
	} );

	it( 'redirects to url from cookie followed by purchase id if create_new_blog is set', () => {
		const getUrlFromCookie = jest.fn( () => '/cookie' );
		const cart = {
			create_new_blog: true,
			products: [ { id: '123' } ],
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			getUrlFromCookie,
			purchaseId: '1234abcd',
		} );
		expect( url ).toBe( '/cookie/1234abcd' );
	} );

	it( 'redirects to url from cookie followed by receipt id if create_new_blog is set', () => {
		const getUrlFromCookie = jest.fn( () => '/cookie' );
		const cart = {
			create_new_blog: true,
			products: [ { id: '123' } ],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
			getUrlFromCookie,
		} );
		expect( url ).toBe( '/cookie/1234abcd' );
	} );

	it( 'redirects to url from cookie followed by order id if create_new_blog is set', () => {
		const getUrlFromCookie = jest.fn( () => '/cookie' );
		const cart = {
			create_new_blog: true,
			products: [ { id: '123' } ],
		};
		const transaction = {
			step: { data: { orderId: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
			getUrlFromCookie,
		} );
		expect( url ).toBe( '/cookie/1234abcd' );
	} );

	it( 'redirects to url from cookie followed by placeholder receiptId if create_new_blog is set and there is no receipt', () => {
		const getUrlFromCookie = jest.fn( () => '/cookie' );
		const cart = {
			create_new_blog: true,
			products: [ { id: '123' } ],
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			getUrlFromCookie,
		} );
		expect( url ).toBe( '/cookie/:receiptId' );
	} );

	// Note: This just verifies the existing behavior; I suspect this is a bug
	it( 'redirects to thank-you page followed by placeholder receiptId twice if no cookie url is set, create_new_blog is set, and there is no receipt', () => {
		const cart = {
			create_new_blog: true,
			products: [ { id: '123' } ],
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/:receiptId/:receiptId' );
	} );

	// Note: This just verifies the existing behavior; I suspect this is a bug
	it( 'redirects to thank-you page followed by purchase id twice if no cookie url is set, create_new_blog is set, and there is no receipt', () => {
		const cart = {
			create_new_blog: true,
			products: [ { id: '123' } ],
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			purchaseId: '1234abcd',
			cart,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd/1234abcd' );
	} );

	it( 'redirects to thank-you page for a new site with a domain and some failed purchases', () => {
		const cart = {
			products: [
				{
					product_slug: 'some_domain',
					is_domain_registration: true,
					extra: { context: 'signup' },
					meta: 'my.site',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: { foo: 'bar' } } },
		};
		mockGSuiteCountryIsValid = true;
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
			isNewlyCreatedSite: true,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd' );
	} );

	it( 'redirects to thank-you page (with display mode) for a new site with a domain and no failed purchases but GSuite is in the cart', () => {
		const cart = {
			products: [
				{
					product_slug: 'gapps',
					meta: 'my.site',
				},
				{
					product_slug: 'some_domain',
					is_domain_registration: true,
					extra: { context: 'signup' },
					meta: 'my.site',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		mockGSuiteCountryIsValid = true;
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
			isNewlyCreatedSite: true,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd?d=gsuite' );
	} );

	it( 'redirects to thank-you page for a new site (via isNewlyCreatedSite) without a domain', () => {
		const cart = {
			products: [
				{
					product_slug: 'some_domain',
					is_domain_registration: false,
					extra: { context: 'signup' },
					meta: 'my.site',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		mockGSuiteCountryIsValid = false;
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
			isNewlyCreatedSite: true,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd' );
	} );

	it( 'redirects to thank-you page (with concierge display mode) for a new site with a domain and no failed purchases but concierge is in the cart', () => {
		const cart = {
			products: [
				{ product_slug: 'concierge-session' },
				{
					product_slug: 'some_domain',
					is_domain_registration: true,
					extra: { context: 'signup' },
					meta: 'my.site',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		mockGSuiteCountryIsValid = false;
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
			isNewlyCreatedSite: true,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd?d=concierge' );
	} );

	it( 'redirects to thank-you page for a new site with a domain and no failed purchases but neither GSuite nor concierge are in the cart if user is in invalid country', () => {
		const cart = {
			products: [
				{
					product_slug: 'some_domain',
					is_domain_registration: true,
					extra: { context: 'signup' },
					meta: 'my.site',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		mockGSuiteCountryIsValid = false;
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
			isNewlyCreatedSite: true,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd' );
	} );

	it( 'redirects to gsuite nudge for a new site with a domain and no failed purchases but neither GSuite nor concierge are in the cart', () => {
		const cart = {
			products: [
				{
					product_slug: 'some_domain',
					is_domain_registration: true,
					extra: { context: 'signup' },
					meta: 'my.site',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		mockGSuiteCountryIsValid = true;
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
			isNewlyCreatedSite: true,
		} );
		expect( url ).toBe( '/checkout/foo.bar/with-gsuite/my.site/1234abcd' );
	} );

	it( 'redirects to premium upgrade nudge if concierge and jetpack are not in the cart, personal is in the cart, and the previous route is not the nudge', () => {
		isEnabled.mockImplementation( flag => flag === 'upsell/concierge-session' );
		const cart = {
			products: [
				{
					product_slug: 'personal-bundle',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
		} );
		expect( url ).toBe( '/checkout/foo.bar/offer-plan-upgrade/premium/1234abcd' );
	} );

	it( 'redirects to concierge nudge if concierge and jetpack are not in the cart, blogger is in the cart, and the previous route is not the nudge', () => {
		isEnabled.mockImplementation( flag => flag === 'upsell/concierge-session' );
		const cart = {
			products: [
				{
					product_slug: 'blogger-bundle',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
		} );
		expect( url ).toBe( '/checkout/offer-quickstart-session/1234abcd/foo.bar' );
	} );

	it( 'redirects to concierge nudge if concierge and jetpack are not in the cart, premium is in the cart, and the previous route is not the nudge', () => {
		isEnabled.mockImplementation( flag => flag === 'upsell/concierge-session' );
		const cart = {
			products: [
				{
					product_slug: 'value_bundle',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
		} );
		expect( url ).toBe( '/checkout/offer-quickstart-session/1234abcd/foo.bar' );
	} );

	it( 'redirects to thank-you page (with concierge display mode) if concierge is in the cart', () => {
		isEnabled.mockImplementation( flag => flag === 'upsell/concierge-session' );
		const cart = {
			products: [
				{
					product_slug: 'concierge-session',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd?d=concierge' );
	} );

	it( 'redirects to thank-you page if jetpack is in the cart', () => {
		isEnabled.mockImplementation( flag => flag === 'upsell/concierge-session' );
		const cart = {
			products: [
				{
					product_slug: 'jetpack_premium',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd' );
	} );

	it( 'redirects to thank you page if concierge and jetpack are not in the cart, personal is in the cart, but the previous route is the nudge', () => {
		isEnabled.mockImplementation( flag => flag === 'upsell/concierge-session' );
		const cart = {
			products: [
				{
					product_slug: 'personal-bundle',
				},
			],
		};
		const transaction = {
			step: { data: { receipt_id: '1234abcd', purchases: {}, failed_purchases: {} } },
		};
		const url = getThankYouPageUrl( {
			siteSlug: 'foo.bar',
			cart,
			transaction,
			previousRoute: '/checkout/foo.bar/offer-plan-upgrade/premium/1234abcd',
		} );
		expect( url ).toBe( '/checkout/thank-you/foo.bar/1234abcd' );
	} );
} );

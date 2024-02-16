// ==UserScript==
// @name         PayPal Add Biller
// @namespace    http://tampermonkey.net/
// @version      0.12.4
// @description  Add old billers to PayPal Bill Pay
// @author       Apocalypsor
// @match        https://www.paypal.com/myaccount/payments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paypal.com
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/Apocalypsor/Rules/master/UserScript/ppbp-add-biller.user.js
// @downloadURL  https://raw.githubusercontent.com/Apocalypsor/Rules/master/UserScript/ppbp-add-biller.user.js
// ==/UserScript==

(function () {
    'use strict';

    const creditCardPayees = [
        {
            externalId: "616ffde06b8cee6bdb96280a-46494e414e4349414c5345525649434553",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "American Express – Personal Cards",
            logoUrl: "https://secure2.paymentus.com/rotp/www/images/rpps/American_Express.png"
        },
        {
            externalId: "308",
            ownerId: "ee5a500b-159a-4527-aefa-8d93572b39a3",
            displayName: "Bank of America",
            logoUrl: "https://images.getbills.com/logos/0000000308001.gif"
        },
        {
            externalId: "578",
            ownerId: "ee5a500b-159a-4527-aefa-8d93572b39a3",
            displayName: "Citi",
            logoUrl: "https://images.getbills.com/logos/0000006827001.jpg"
        },
        {
            externalId: "5314",
            ownerId: "ee5a500b-159a-4527-aefa-8d93572b39a3",
            displayName: "Discover Card",
            logoUrl: "https://images.getbills.com/logos/0000005314001_discover.jpg"
        },
        {
            externalId: "62455e87d82af71c627f5090",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "Wells Fargo",
            logoUrl: "https://secure2.paymentus.com/rotp/www/images/rpps/Wells%20Fargo_logo.png"
        },
        {
            externalId: "5f91ed869c92e7f690fd4b2d",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "US Bank",
            logoUrl: "https://secure2.paymentus.com/rotp/www/images/rpps/US%20Bank_logo.png"
        },
        {
            externalId: "623b776077c015daf581708c",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "Capital One",
            logoUrl: "https://secure2.paymentus.com/rotp/www/images/rpps/Capital_One.png"
        },
        {
            externalId: "5f91ed1f9c92e7f690faad47",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "HSBC",
            logoUrl: "https://secure2.paymentus.com/rotp/www/images/rpps/HSBC.png"
        },
        {
            externalId: "5f91ecc29c92e7f690f8608a",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "Apple Card",
            logoUrl: "https://pbs.twimg.com/profile_images/1163895675513274368/gk5MAZvy_400x400.png"
        },
        {
            externalId: "5f91ed799c92e7f690fcfe95",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "Target RedCard",
            logoUrl: "https://secure2.paymentus.com/rotp/www/images/rpps/Target.png"
        },
    ];

    const taxPayees = [
        {
            externalId: "5f91ed399c92e7f690fb6050",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "Maria Pappas Cook County Treasurer",
            logoUrl: "https://cdn.finovera.com/static/direct/MariaPappasCookCountyTreasurer_logo.png",
        },
    ];

    const mapPayee = (d) => ({
        externalId: d.externalId,
        ownerId: d.ownerId,
        displayName: d.displayName,
        logoUrl: { href: d.logoUrl },
        alias: null,
        category: null,
        highlights: { displayName: [], alias: [] },
    });

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && /suggested-payees\/pp(bp|tax)\?/.test(this.responseURL)) {
                try {
                    const json = JSON.parse(this.responseText);
                    const isCreditCard = this.responseURL.includes('suggested-payees/ppbp?');

                    const selectedPayees = isCreditCard ? creditCardPayees : taxPayees;

                    json.data.payees.payees = selectedPayees.map(mapPayee);
                    json.data.payees.totalItems = selectedPayees.length;
                    json.data.payees.totalPages = 1;

                    const modifiedResponse = JSON.stringify(json);
                    Object.defineProperty(this, 'response', { writable: true });
                    Object.defineProperty(this, 'responseText', { writable: true });
                    this.response = modifiedResponse;
                    this.responseText = modifiedResponse;
                } catch (e) {
                    console.error('Could not parse the response as JSON:', e);
                }
            }
        }, false);

        originalOpen.apply(this, arguments);
    };

})();

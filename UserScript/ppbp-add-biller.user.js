// ==UserScript==
// @name         PayPal Add Biller
// @namespace    http://tampermonkey.net/
// @version      0.10.2
// @description  Add old billers to PayPal Bill Pay
// @author       Apocalypsor
// @match        https://www.paypal.com/myaccount/payments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paypal.com
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/Apocalypsor/Rules/master/UserScript/ppbp-add-biller.user.js
// @downloadURL  https://raw.githubusercontent.com/Apocalypsor/Rules/master/UserScript/ppbp-add-biller.user.js
// ==/UserScript==

(function() {
    'use strict';

    const customePayees = [
        {
            externalId: "5f91ecc09c92e7f690f8569c",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "American Express - All Cards",
            logoUrl: {
                href: "https://secure2.paymentus.com/rotp/www/images/rpps/American_Express.png"
            },
            alias: "American Express",
            category: "CREDITCARDS",
            highlights: {
                displayName: [
                    "american",
                    "express"
                ],
                alias: []
            }
        },
        {
            externalId: "616ffde06b8cee6bdb96280a-46494e414e4349414c5345525649434553",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "American Express – Personal Cards",
            logoUrl: {
                href: "https://secure2.paymentus.com/rotp/www/images/rpps/American_Express.png"
            },
            alias: "American Express",
            category: "CREDITCARDS",
            highlights: {
                displayName: [
                    "american",
                    "express"
                ],
                alias: []
            }
        },
        {
            externalId: "5f91ece19c92e7f690f92839",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "Chase",
            logoUrl: {
                href: "https://secure2.paymentus.com/rotp/www/images/rpps/Chase_Bank.png"
            },
            alias: "Chase",
            category: "CREDITCARDS",
            highlights: {
                displayName: [
                    "chase"
                ],
                alias: []
            }
        },
        {
            externalId: "308",
            ownerId: "ee5a500b-159a-4527-aefa-8d93572b39a3",
            displayName: "Bank of America",
            logoUrl: {
                href: "https://images.getbills.com/logos/0000000308001.gif"
            },
            alias: "Bank of America",
            category: "CREDITCARDS",
            highlights: {
                displayName: [
                    "bank",
                    "of",
                    "america"
                ],
                alias: []
            }
        },
        {
            externalId: "578",
            ownerId: "ee5a500b-159a-4527-aefa-8d93572b39a3",
            displayName: "Citi",
            logoUrl: {
                href: "https://images.getbills.com/logos/0000006827001.jpg"
            },
            alias: "Citi",
            category: "CREDITCARDS",
            highlights: {
                displayName: [
                    "citi"
                ],
                alias: []
            }
        },
        {
            externalId: "5314",
            ownerId: "ee5a500b-159a-4527-aefa-8d93572b39a3",
            displayName: "Discover Card",
            logoUrl: {
                href: "https://images.getbills.com/logos/0000005314001_discover.jpg"
            },
            alias: "Discover Card",
            category: "CREDITCARDS",
            highlights: {
                displayName: [
                    "discover"
                ],
                alias: []
            }
        },
        {
            externalId: "62455e87d82af71c627f5090",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "Wells Fargo",
            logoUrl: {
                href: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Wells_Fargo_Logo_%282020%29.svg/2048px-Wells_Fargo_Logo_%282020%29.svg.png"
            },
            alias: "Wells Fargo",
            category: "CREDITCARDS",
            highlights: {
                displayName: [
                    "wells",
                    "fargo"
                ],
                alias: []
            }
        },
        {
            externalId: "5f91ecc29c92e7f690f8608a",
            ownerId: "c046047f-0197-43d6-a057-886b6f99817a",
            displayName: "Apple Card",
            logoUrl: {
                href: "https://pbs.twimg.com/profile_images/1163895675513274368/gk5MAZvy_400x400.png"
            },
            alias: "Apple Card",
            category: "CREDITCARDS",
            highlights: {
                displayName: [
                    "apple",
                    "card"
                ],
                alias: []
            }
        }
    ];

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && this.responseURL.includes('suggested-payees/ppbp?')) {
                try {
                    const json = JSON.parse(this.responseText);
                    json.data.payees.payees = customePayees;
                    json.data.payees.totalItems = customePayees.length;
                    json.data.payees.totalPages = 1;

                    const modifiedResponse = JSON.stringify(json);
                    Object.defineProperty(this, 'response', {writable: true});
                    Object.defineProperty(this, 'responseText', {writable: true});
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

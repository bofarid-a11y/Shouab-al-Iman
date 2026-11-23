# Beoordelingen met Google Apps Script

Status: de nieuwe webapp is geconfigureerd. Een test vanuit Apps Script verstuurde twee POST-verzoeken met rol Leerling en beroep Student; de NL- en AR-testregels zijn in de juiste tabbladen en kolommen gecontroleerd. Een daadwerkelijke browserinzending via de vernieuwde gepubliceerde website moet nog worden gecontroleerd. De bestaande vragen zijn ongewijzigd. De formulieren blijven uitgeschakeld als `review-config.js` geen geldig webapp-adres bevat.

## Uitbreiding: rol en beroep

De bijgewerkte `Code.gs` accepteert de optionele velden `reviewerRole` en `profession` en schrijft ze naar kolommen G en H. Ook oude formulieren zonder deze velden blijven werken. De eigenaar heeft een nieuwe webapp-URL aangeleverd; een test bevestigde opslag van beide velden in beide tabbladen. De kolomkoppen G/H zijn toegevoegd en bestaande data behouden. De eerder gebruikte webapp-URL is een andere implementatie en mag niet voor deze nieuwe velden worden gebruikt zonder afzonderlijke verificatie.

De website toont als rol alleen Leerling, Ouder / verzorger en Anders. De backend accepteert ook de eerdere rolwaarden voor oude open formulieren. De beroepslijst is een voorstel: de volledige eerdere lijst was niet zichtbaar in de aangeleverde afbeelding. Voor beide velden worden vaste, Nederlandse waarden opgeslagen, ook vanuit de Arabische interface. Dit maakt filteren in beide overzichten eenvoudig. De velden zijn optioneel om geen onnodige persoonsgegevens af te dwingen. Deze informatie kan in combinatie met andere gegevens identificerend zijn; beperk inzage en vraag geen namen of andere persoonsgegevens.

## Eenmalige activatie door de eigenaar

1. Open https://script.google.com/ met het Google-account dat het beoordelingenoverzicht kan bewerken en maak een nieuw project.
2. Vervang de inhoud van `Code.gs` door de volledige inhoud van het bestand `Code.gs` in deze map en sla op.
3. Kies **Implementeren → Nieuwe implementatie → Web-app**. Laat de app uitvoeren als jezelf en geef toegang aan **Iedereen**, zodat bezoekers zonder Google-account hun beoordeling kunnen insturen. Google vraagt je de gevraagde toegang tot spreadsheets te beoordelen en te autoriseren.
4. Deel uitsluitend de webapp-URL die op `/exec` eindigt om de website te configureren. Deel geen wachtwoorden, codes of tokens.
5. Vul die URL in `review-config.js` in. Test de webapp met duidelijk herkenbare testinzendingen voor beide lestalen; controleer de juiste rijen in het spreadsheet en wis geen bestaande reacties. Controleer na publicatie ook de echte live formulierwerking via een browser.

Deze methode verstuurt de bezoeker na een gewone POST naar een antwoordpagina van Google. Alleen een succesvolle bevestigde opslag laat een bedankbericht zien. De code schrijft datum, groep, taal, twee beoordelingen en de optionele opmerking naar het tabblad Nederlandse les of Arabische les. De gekozen lestaal bepaalt het tabblad; de taal van de interface bepaalt alleen de taal van de melding. Het oorspronkelijke overzicht blijft behouden en ontvangt geen nieuwe inzendingen. Bescherm het spreadsheet tegen publieke leestoegang. Vraag geen persoonsgegevens in de vrije tekst. De publiek toegankelijke webapp kan door derden worden aangeroepen; misbruik/spam en Google-quota blijven mogelijke beperkingen. Het URL-adres is geen geheim of toegangsbeveiliging. De accountbeheerder kan de implementatie uitschakelen. Bewaar eventuele persoonsgegevens niet langer dan nodig en beoordeel privacyverplichtingen voordat de site publiek wordt gebruikt.

`tests/review-backend.test.cjs` gebruikt mocks voor Google-diensten. `tests/review-form.test.cjs` gebruikt jsdom; deze simulaties zijn geen bewijs dat een echte Google-implementatie werkt. Zie de hoofddocumentatie voor de status van lesmateriaal en iPhone-tests.

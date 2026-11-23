# CUR001 — voorlopige inspectie gerepareerde websitecandidate

Status: **voorlopige technische audit**, geen vrijgave of inhoudelijke goedkeuring.

## Scope en herkomst

De aangeleverde Google Drive-link bevat `CUR001_Netlify_Lesson_Buttons_Fix_v1 (2).zip` (31.200 bytes; MD5 `4724864b7bf1d5f19ef876bfb1791642`, gelijk aan de Drive-metadata). Het archief bevat 22 bestanden: 17 HTML-pagina's, drie CSS-bestanden en twee Netlify-configuratiebestanden. De digitale lesdata bevatten twaalf combinaties: groep 3–8, Nederlands en Arabisch. De oorspronkelijke bestanden in Drive zijn niet gewijzigd.

Het in de overdracht genoemde originele archief `6b04518b5aaff0ab78e0fb1d-92a04912ce6edd37.zip` is niet gevonden bij een zoekopdracht op bestandsnaam in de verbonden Drive en Dropbox. Het verschil tussen origineel en candidate kan daardoor niet worden vastgesteld. Een bestandsnaam of overdracht is geen bewijs van een specifieke wijziging.

## Uitgevoerde controles

- ZIP-inhoud en controlesom bekeken; alle lokale bestandsverwijzingen die als HTML-attribuut zijn gevonden bestaan in het uitgepakte archief. Dit is geen controle van alle dynamische verwijzingen.
- In een gesimuleerde DOM met jsdom zijn de twaalf directe les-URL's geladen en de basisinteracties nagebootst: initieel taal/groep, drie antwoordopties, labels, melding bij geen keuze, onjuist antwoord en opnieuw proberen, juist antwoord en reflectie, evaluatielink, en aanroep van voorleesfunctie met een mock. Resultaat: 12/12 geslaagd zonder gerapporteerde JavaScript-fouten in deze tests. Testscript: `tests/candidate-audit.cjs`.
- De openbare startpagina van `startling-semolina-957f2a.netlify.app` leverde tijdens deze inspectie inhoud op. Dit bewijst **niet** welke ZIP-versie daar draait of dat interactieve functies en formulieren live werken.

De jsdom-test is geen echte browser- of iPhone/Safari-test. Er zijn geen screenshots, contrastmetingen, A4-printtesten, echte audiotesten of echte Netlify-inzendingen uitgevoerd. De test bevestigt niet dat een spraakstem voor elke taal op een specifiek apparaat aanwezig is: het archief gebruikt de voorleesfunctie van het apparaat, geen bijgeleverde audiobestanden. Ontvangst en opslag van evaluaties zijn niet getest; de formulieren gebruiken Netlify Forms, waarvan de site-instellingen en ontvangst apart geverifieerd moeten worden.

## Aandachtspunten vóór een release-candidate

1. Vergelijk met het originele ZIP-bestand en documenteer de exacte wijzigingen. Onderzoek ook of de live website overeenkomt met de gekozen basis; een bereikbare pagina is geen versiebewijs.
2. Een onjuist antwoord krijgt momenteel een algemene aansporing om opnieuw te proberen, geen inhoudelijke uitleg specifiek voor de gekozen optie. Dat voldoet nog niet volledig aan de opgegeven interactienorm.
3. De papieren en digitale afsluiting verschillen aantoonbaar bij groep 3 Nederlands en Arabisch. Een inhoudelijke vergelijking van alle twaalf varianten met de bedoelde bron en de projectleider is nodig; verander geen vergrendelde brontekst.
4. De lange administratieve voetnoot en interne candidatecode zijn uit de digitale lesweergave verwijderd. Een korte proefstatus en privacyzin blijven zichtbaar; aanvullende informatie staat bij de beoordeling. De papieren kandidaatbestanden zijn daarbij niet inhoudelijk gewijzigd en hun opmerkingen blijven een aandachtspunt. De vrijgavestatus zelf is ongewijzigd.
5. Test de knoppen, leesbaarheid, richtingen en de twaalf routes in echte browsers en op iPhone/Safari. Test audio met beschikbare Nederlandse en Arabische stemmen op het apparaat.
6. Controleer Netlify Forms en bevestig ontvangst met een herkenbare testinzending, zonder onnodige persoonsgegevens. Beoordeel privacy en noodzakelijke velden voordat bezoekers feedback insturen.
7. Een papieren deep-link mag pas als definitieve QR-code worden vrijgegeven na controle op de beoogde publieke URL. Geen Netlify-deploy uitgevoerd.

## Reproduceerbare simulatie

Pak de candidate veilig uit in een aparte map. Installeer jsdom 26 in een tijdelijke testmap en stel `NODE_PATH` in naar diens `node_modules`. Voer uit: `node tests/candidate-audit.cjs /pad/naar/uitgepakte-candidate/lesson.html`. De test gebruikt een mock voor spraak en vervangt geen browser- of live-test.

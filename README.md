Features:

-Long press + add new button to directly add image
-Click between notes to the left side to add a note into specific location
-visit additional details and click secure note to add a private note

3/12/24

-   NB on running
    -- Have had to make a developmnet build so can't dev on my physical phone anymore.
    -- npx expo run:android --device Pixel_6_Pro_API_33 should load a simulator via android studio and can dev that way.
    --- if we do eas build --profile=development --platform=android we get a dev version on my phone, but it only works when there is an expo server running locally so cant use the app in prod - npx expo start will run that for using development build on phone
    --- eas build --profile=preview --platform=android should give me an apk i can use on my phone

^ these notes are from memory a week after figuring it out for first time so may not be exact 100%

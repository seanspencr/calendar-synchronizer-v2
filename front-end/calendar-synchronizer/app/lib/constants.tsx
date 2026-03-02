export const pagePath = {
    // root
    fromRoot : {
        registerScreen : "(auth)/registerScreen",
        loginScreen : "(auth)/index",
        main : "(main)",
        dashboard : "(main)/dashboard",
        profile : "(main)/profile"
    },

    fromMain : {
        registerScreen : "../(auth)/registerScreen",
        loginScreen : "../(auth)/index",
        main : "./",
        dashboard : "dashboard",
        profile : "profile"
    }
}
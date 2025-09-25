export const authConfig = {
    session: {
        strategy: 'jwt' as const,
    },
    providers: [],
    pages: {
        signIn: '/login',
    },
}
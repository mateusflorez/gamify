export const checkCurrentUser = async () => {
    const user = localStorage.getItem('user')
    if (user) {
        setCurrentUser(await JSON.parse(user))
        getMissions()
    }
}

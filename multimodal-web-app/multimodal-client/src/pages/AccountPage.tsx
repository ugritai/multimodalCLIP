export function AccountPage(){
    const username = window.localStorage.getItem("username");
    return (
        <div>
            <header><h1>{username}</h1></header>
            Aquí añadir opción para cambiar la contraseña
        </div>
    )
}
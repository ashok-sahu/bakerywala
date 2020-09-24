import cookie from 'js-cookie'

//set in cookie
export const setCookie = (key,value)=>{
    if(window!=='undefined'){
        cookie.set(key,value,{
            //expiry in 1 day
            expires:1  
        })
    }
}

//remove from cookie
export const removeCookie = key =>{
    if(window!=='undefined'){
        cookie.remove(key,{
            expires:1
        })
    }
}

//get from cookie like token
export const getCookie = key =>{
    if(window!=='undefined'){
        return cookie.get(key)
    }
}

//set in localstorage
export const setLocalStorage = (key,value)=>{
    if(window!=='undefined'){
        localStorage.setItem(key,JSON.stringify(value))
    }
}

//remove from localstorage
export const removeLocalStorage = key =>{
    if(window!=='undefined'){
        localStorage.removeItem(key)
    }
}

//Auth user after login
export const authenticate = (response,next)=>{
    setCookie('token',response.data.token)
    setLocalStorage('user',response.data.user)
    next()
}

//signOut
export const signOut = next =>{
    removeCookie('token')
    removeLocalStorage('user')
}

//get userInfo from localstorage
export const isAuth = () =>{
    if(window !== 'undefined'){
        const cookieChecked = getCookie
        if(cookieChecked){
            if(localStorage.getItem('user')){
                return JSON.parse(localStorage.getItem('user'))
            }else{
                return false
            }
        }
    }
}

//update userdata in localstorage
export const updateUser = (response,next) =>{
    if(window !== 'undefined'){
        let auth = JSON.parse(localStorage.getItem('user'))
        auth = response.data
        localStorage.setItem('user',JSON.stringify(auth))
    }
    next()
}

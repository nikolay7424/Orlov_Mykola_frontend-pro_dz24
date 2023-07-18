const modal = document.querySelector('dialog')
const ul = document.querySelector('.user-list')

let users = []
let currentIndex;

ul.addEventListener('click', userButtonHandler)
window.addEventListener('click', windowClickHandler)
window.addEventListener('load', loadUsers)

function userButtonHandler(e) {
    if(e.target.classList.contains('btn-view')) {
        let index = Array.from(ul.children).indexOf(e.target.parentElement)
        viewUser(e, users[index])
    } else if (e.target.classList.contains('btn-edit')){
        updateUser(e)
    } else if(e.target.classList.contains('btn-remove')) {
        modal.innerHTML = ''

        modal.innerHTML = `
            <h2>are you sure?</h2>
            <div class="button-wrapper">
                <button class="btn btn-yes">yes</button>
                <button class="btn btn-no">no</button>
            </div>`
        modal.classList.add('modal-small')
        modal.showModal()
        currentIndex = Array.from(ul.children).indexOf(e.target.parentElement)
        modal.addEventListener('click', removeHandler)
    }
}

function removeHandler(e) {
    if (e.target.classList.contains('btn-yes')) {
        modal.close()
        ul.children[currentIndex].remove()
        users.splice(currentIndex, 1)
        updateLS()
        ul.innerHTML = ''
        loadUsers()
        modal.removeEventListener('click', removeHandler)
        modal.classList.remove('modal-small')

    } else {
        modal.close()
        modal.removeEventListener('click', removeHandler)
        modal.classList.remove('modal-small')

    }
}

function viewUser(e, user) {
    e.preventDefault()
    modal.innerHTML = ''
    const table = document.createElement('table')
    createTableRow('First Name:', user.firstname, table)
    createTableRow('Last Name:', user.lastname, table)
    createTableRow('birthdate:', user.birthdate, table)
    createTableRow('email:', user.email, table)
    createTableRow('phone:', user.phone, table)
    modal.appendChild(table)
    modal.classList.remove('modal-small')
    modal.showModal()
}

function createTableRow(key, value, table) {
    const tr = document.createElement('tr')
    tr.innerHTML = `<tr>
        <td>${key}</td>
        <td>${value}</td>
    </tr>`
    table.appendChild(tr)
}

function addUser(e) {
    e.preventDefault()
        modal.innerHTML = ''
        const form = document.createElement('form')
        form.innerHTML = `<form autocomplete="off">
            <div class="input">
                <label for="afirstname">First name:</label>
                <input autocomplete="off" type="text" placeholder="type your first name" name="afirstname" id="afirstname">
                <span class="error"></span>
            </div>
            <div class="input">
                <label for="alastname">Last name:</label>
                <input autocomplete="off" type="text" placeholder="type your last name" name="alastname" id="alastname">
                <span class="error"></span>
            </div>
            <div class="input">
                <label for="abirthdate">Birthdate:</label>
                <input autocomplete="off" type="date" min="1905-01-01" max="2015-12-31" name="abirthdate" id="abirthdate">
                <span class="error"></span>
            </div>
            <div class="input">
                <label for="aemail">Email:</label>
                <input autocomplete="off" type="email" placeholder="type your email" name="aemail" id="aemail">
                <span class="error"></span>
            </div>
            <div class="input">
                <label for="aphone">Phone:</label>
                <input autocomplete="off" type="text" placeholder="type your phone" value="+38" name="aphone" id="aphone">
                <span class="error"></span>
            </div>
            <button class="btn btn-register">register</button>
        </form>`
        modal.appendChild(form)
        modal.classList.remove('modal-small')
        modal.showModal()
        modal.addEventListener('keyup', modalValidator)
        modal.addEventListener('keydown', modalValidator)
        modal.addEventListener('click', modalValidator)
        modal.addEventListener('change', modalValidator)
        modal.addEventListener('input', modalValidator)
}
function updateUser(e) {
    e.preventDefault()
    let index = Array.from(ul.children).indexOf(e.target.parentElement)
    let user = users[index];
    currentIndex = index
    modal.innerHTML = ''
    const form = document.createElement('form')
    form.innerHTML = `<form autocomplete="off">
        <div class="input">
            <label for="afirstname">First name:</label>
            <input value="${user.firstname}" autocomplete="off" type="text" placeholder="type your first name" name="afirstname" id="afirstname">
            <span class="error"></span>
        </div>
        <div class="input">
            <label for="alastname">Last name:</label>
            <input value="${user.lastname}" autocomplete="off" type="text" placeholder="type your last name" name="alastname" id="alastname">
            <span class="error"></span>
        </div>
        <div class="input">
            <label for="abirthdate">Birthdate:</label>
            <input value="${user.birthdate}" autocomplete="off" type="date" min="1905-01-01" max="2015-12-31" name="abirthdate" id="abirthdate">
            <span class="error"></span>
        </div>
        <div class="input">
            <label for="aemail">Email:</label>
            <input value="${user.email}" autocomplete="off" type="email" placeholder="type your email" name="aemail" id="aemail">
            <span class="error"></span>
        </div>
        <div class="input">
            <label for="aphone">Phone:</label>
            <input value="${user.phone}" autocomplete="off" type="text" placeholder="type your phone" value="+38" name="aphone" id="aphone">
            <span class="error"></span>
        </div>
        <button class="btn btn-save">save</button>
    </form>`
    modal.appendChild(form)
    modal.classList.remove('modal-small')
    modal.showModal()
    modal.addEventListener('keyup', modalValidator)
    modal.addEventListener('keydown', modalValidator)
    modal.addEventListener('click', modalValidator)
    modal.addEventListener('change', modalValidator)
    modal.addEventListener('input', modalValidator)
}

function windowClickHandler(e) {
    if(e.target.classList.contains('btn-add')) {
        addUser(e)
    }
    if(e.target.classList.contains('btn')) {
        return
    }
    const modalDimentions = modal.getBoundingClientRect();  
    if(
        e.clientX < modalDimentions.left ||
        e.clientX > modalDimentions.right ||
        e.clientY < modalDimentions.top ||
        e.clientY > modalDimentions.bottom
        ) {
        modal.removeEventListener('keyup', modalValidator)
        modal.removeEventListener('keydown', modalValidator)
        modal.removeEventListener('click', modalValidator)
        modal.removeEventListener('change', modalValidator)
        modal.removeEventListener('input', modalValidator)
        modal.close();
    }

}

function loadUsers(e) {
    if(!localStorage.getItem('users')) {
        users = usersFileArr
        showUsers(users)
    } else {
        users = JSON.parse(localStorage.getItem('users'))
        showUsers(users)
    }
}

function showUsers(usersArr) {
    for(let user of usersArr) {
        const li = document.createElement('li')
        li.classList.add('user-list-item')
        li.innerHTML = `
            <span>${user.firstname}</span>
            <span>${user.lastname}</span>
            <button class="btn btn-view">view</button>
            <button class="btn btn-edit">edit</button>
            <button class="btn btn-remove">remove</button>`
        ul.appendChild(li)
    }
}

// validation
function modalValidator(e) {
    switch(e.type) {
        case('click'):
            if(e.target.tagName === 'BUTTON') {
                e.preventDefault()
                if(
                    validateTextInput(e.target.parentElement.children[0].children[1]) 
                    && validateTextInput(e.target.parentElement.children[1].children[1]) 
                    && validateDateInput(e.target.parentElement.children[2].children[1])
                    && validateEmailInput(e.target.parentElement.children[3].children[1]) 
                    && validateNumberInput(e.target.parentElement.children[4].children[1]))
                    {
                        if(e.target.classList.contains('btn-register')) {
                            const newUser = {}
                            newUser.firstname = e.target.parentElement.children[0].children[1].value
                            newUser.lastname = e.target.parentElement.children[1].children[1].value
                            newUser.birthdate = e.target.parentElement.children[2].children[1].value
                            newUser.email = e.target.parentElement.children[3].children[1].value
                            newUser.phone = e.target.parentElement.children[4].children[1].value
                            users.push(newUser)
                        } else if(e.target.classList.contains('btn-save')) {
                            let user = users[currentIndex]
                            user.firstname = e.target.parentElement.children[0].children[1].value
                            user.lastname = e.target.parentElement.children[1].children[1].value
                            user.birthdate = e.target.parentElement.children[2].children[1].value
                            user.email = e.target.parentElement.children[3].children[1].value
                            user.phone = e.target.parentElement.children[4].children[1].value
                        } 
                        updateLS()
                        e.target.parentElement.submit()
                }
            }
            break
        case('keyup'):
            if(e.target.id === 'aphone') {
                validateNumberInput(e.target)
            }else if(e.target.type === 'text') {
                validateTextInput(e.target)
            } else if(e.target.type === 'email') {
                validateEmailInput(e.target)
            }
            break
        case('change'):
            if(e.target.id === 'aphone') {
                if(e.target.value === '') {
                    e.target.value = '+38'
                }
            } else if(e.target.type === 'date') {
                validateDateInput(e.target)
            }
            break
        case('input'):
            if(e.target.id === 'aphone') {
                let valueArr = e.target.value.split('')
                let spliceString = valueArr.splice(0, 3)
                spliceString = spliceString.join('')
                if(spliceString !== '+38') {
                    e.target.value = '+38'
                }
            }
            break
        case('keydown'):
            if(e.target.id === 'aphone') {
                if(e.target.value.length === 3 && e.keyCode === 8) {
                    e.target.value = '+38'
                    e.preventDefault()
                    return
                } else if(e.target.value.length === 13) {
                    e.preventDefault()
                    return
                } 
                if(e.keyCode === 8) {

                } else if(e.keyCode < 48 || e.keyCode > 57) {
                    if(e.keyCode < 96 || e.keyCode > 105) {
                        e.preventDefault()
                        return
                    }
                } 
            } if(e.target.type === 'text' && e.target.value.length > 20) {
                e.preventDefault()
                return
            }
            break
    }
}

function validateTextInput(input) {
    if(input.value.length === 0) {
        showErrorMessage(input, `${input.previousElementSibling.textContent} cannot be empty`, 'red')
        return false
    } else if(input.value.length < 3) {
        showErrorMessage(input, `${input.previousElementSibling.textContent} must be at least 3 characters long`, 'red')
        return false
    } else if(input.value.match(/[a-zA-Zа-яА-Яа-яА-я\-\s]{3,}/)[0].length !== input.value.length) {
        showErrorMessage(input, `${input.previousElementSibling.textContent} must not have numbers or symbols`, 'red')
        return false
    } else {
        showErrorMessage(input, '', '#2ed834')
        return true
    }
}

function validateEmailInput(input) {
    if(input.value.length === 0) {
        showErrorMessage(input, `${input.previousElementSibling.textContent} cannot be empty`, 'red')
        return false
    } else if(!input.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        showErrorMessage(input, `${input.previousElementSibling.textContent} is not valid`, 'red')
        return false
    } else {
        showErrorMessage(input, '', '#2ed834')
        return true
    }
}

function validateNumberInput(input) {
    if(!input.value.match(/\+[0-9]{12}/)) {
        showErrorMessage(input, `${input.previousElementSibling.textContent} is invalid`, 'red')
        if(input.value === '') {
            input.value = '+38'
        }
        return false
    } else {
        showErrorMessage(input, '', '#2ed834')
        return true
    }
}

function validateDateInput(input) {
    if(input.value.length === 0) {
        showErrorMessage(input, `${input.previousElementSibling.textContent} choose date`, 'red')
        return false
    } else {
        showErrorMessage(input, '', '#2ed834')
        return true
    }
}

function showErrorMessage(input, message, color)  {
    input.style.borderColor = color
    input.nextElementSibling.textContent = message
}

function updateLS() {
    localStorage.setItem('users', JSON.stringify(users))
}
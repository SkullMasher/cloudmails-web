const greetingMessage = () => {
  console.log(`  #####   `)
  console.log(` #######  `)
  console.log(`#  ###  #  Hello There`)
  console.log(`#   #   # `)
  console.log(`#########  Come contribute to the code !`)
  console.log(` ### ###  `)
  console.log(`  #####    github.com/SkullMasher/cloudmails-web`)
  console.log(`  # # #   `)
}

let formChecker = () => {
  // input selector
  const $mailInput = document.querySelector('.js-inputMail')
  const $mailPass = document.querySelector('.js-inputMailPass')
  const $mailSubmit = document.querySelector('.js-mailSubmit')
  const $newUserDebug = document.querySelector('.js-newUserDebug')

  // states
  let mailInputIsCorrect = false
  let mailPassIsCorrect = false

  // functions
  const isFormCompleted = () => {
    if (mailInputIsCorrect && mailPassIsCorrect) {
      $mailSubmit.disabled = false
      return true
    } else {
      return false
    }
  }

  const postNewMail = async (location, data) => {
    const fetchSettings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    }

    const response = await fetch(location, fetchSettings)
    return response.json()
  }

  const isMailUniq = async (location, data) => {
    const fetchSettings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([data])
    }

    const response = await fetch(location, fetchSettings)
    return response.json()
  }

  // Events
  $mailInput.addEventListener('input', (event) => {
    // https://stackoverflow.com/questions/388996/regex-for-javascript-to-allow-only-alphanumeric#389022
    mailInputIsCorrect =  /^[a-z0-9]+$/i.test($mailInput.value)
    if (mailInputIsCorrect) {
      isMailUniq(location.href, $mailInput.value)
        .then(response => {
          if (response) {
            mailInputIsCorrect = true
            $mailInput.classList.remove('form-newmail__input--invalid')
            $mailInput.classList.add('form-newmail__input--valid')
            $newUserDebug.classList.replace('color--danger', 'color--success')
            $newUserDebug.innerText = '✓'

          } else {
            mailInputIsCorrect = false
            $mailInput.classList.remove('form-newmail__input--valid')
            $mailInput.classList.add('form-newmail__input--invalid')
            $newUserDebug.classList.replace('color--success', 'color--danger')
            $newUserDebug.innerText = 'Ce mail éxiste déjà'
          }
        }).catch(err => {
          $newUserDebug.classList.replace('color--success', 'color--danger')
          $newUserDebug.innerText = 'une érreur inconnue est survenue'
        })
    } else {
      mailInputIsCorrect = false
      $mailInput.classList.remove('form-newmail__input--valid')
      $mailInput.classList.add('form-newmail__input--invalid')
      $newUserDebug.classList.replace('color--success', 'color--danger')
      $newUserDebug.innerText = 'Charactère spéciaux non autorisé'
    }

    isFormCompleted()
  })

  $mailPass.addEventListener('input', (event) => {
    if ($mailPass.value) {
      mailPassIsCorrect = true
      $mailPass.classList.remove('form-newmail__input--invalid')
      $mailPass.classList.add('form-newmail__input--valid')
    } else {
      mailPassIsCorrect = false
      $mailPass.classList.remove('form-newmail__input--valid')
      $mailPass.classList.add('form-newmail__input--invalid')
    }

    isFormCompleted()
  })

  $mailSubmit.addEventListener('click', (event) => {
    if (isFormCompleted()) {
      event.preventDefault()
      const data = JSON.stringify([$mailInput.value, $mailPass.value])

      postNewMail(location.href, data)
        .then(response => {
          switch (response) {
            case true:
              //reset fields for new addition
              $mailInput.value = ''
              $mailPass.value = ''
              mailInputIsCorrect = false
              mailPassIsCorrect = false
              $mailSubmit.disabled = true
              $newUserDebug.innerText = ''
              $mailInput.classList.remove('form-newmail__input--valid')
              $mailPass.classList.remove('form-newmail__input--valid')
            case 23000:
              console.log('Ce mail éxiste déjà')
              break;
            default:
              console.log('une érreur est survenue')
              break;
          }
        })
        .catch(err =>{
          console.log(err)
        })
    }
  })
}

addEventListener('DOMContentLoaded', (event) => {
  greetingMessage()
  formChecker()
})

const greetingMessage = () => {
  console.log(`  #####   `)
  console.log(` #######  `)
  console.log(`#  ###  #  Hello There`)
  console.log(`#   #   # `)
  console.log(`#########  Come contribute to the code !`)
  console.log(` ### ###  `)
  console.log(`  #####    github.com/SkullMasher/wish-card-2019`)
  console.log(`  # # #   `)
}

let formChecker = () => {
  // input selector
  const $deleteMail = document.querySelectorAll('.js-deleteMail')

  // functions
  const postDeleteMail = async (location, data) => {
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

  $deleteMail.forEach((btn, index) => {
    const mailAddress = btn.previousSibling.textContent
    const mailUsername = mailAddress.split('@')[0]

    btn.addEventListener('click', (event) => {
      postDeleteMail(location.href, JSON.stringify([btn.dataset.id, mailUsername]))
        .then(response => {
          btn.parentNode.remove()
        })
        .catch(err => {
          console.log(JSON.parse(err))
        })
    })
  })
}

addEventListener('DOMContentLoaded', (event) => {
  greetingMessage()
  formChecker()
})

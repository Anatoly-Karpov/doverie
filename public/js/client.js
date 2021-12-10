
// const { editProfile } = document.forms;
// const { id } = document.forms.editProfile

// editProfile.addEventListener('submit', async (e) => {
//   e.preventDefault()

//   const temp = document.editProfile.title.value
//   const response = await fetch(`/profile/edit/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-type': 'application/json',
//     },
//     body: JSON.stringify({ title: temp }),

//   })
//   const temp1 = await response.json()
//   document.editProfile.title.value = temp1.title;
//   window.location.assign('/profile')
// }
// )

const { editUserForm } = document.forms;
console.log(editUserForm);

editUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const updatedUser = { firstName: editUserForm.firstName.value, email: editUserForm.email.value, bDay: editUserForm.bDay.value };
  const updRequest = await fetch(`/${editUserForm.dataset.userid}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });
  if (updRequest.status === 200) {
    alert('данные обновлены');
  } else {
    alert('какая-то ошибка, попробуйте еще раз позднее');
  }
});



const { editUserForm } = document.forms;
const deleteButton = document.getElementById('deleteButton');

editUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(editUserForm.firstName.value);
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

deleteButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const { userid } = e.target.dataset; // достаем userid из дата-атрбутов нажатой кнопки
  if (e.target.dataset.action === 'delete') {
    const delRequest = await fetch(`/${userid}`, { method: 'DELETE' }); // методом DELETE обращаемся на адрес /users/айдиюзера
    if (delRequest.status >= 200) { // если удалось удалить, возвращаем статус 222
      alert('user delete')
      window.location.assign('/registration')
    } else { // если не удалось удалить, статус будет другой (это и есть идемпотентность)
      alert('этого юзера давно уже тут нет');
    }
  } else if (e.target.dataset.action === 'edit') {
    window.location.assign(`/${userid}`); // редирект на страницу редактирования
  }
});



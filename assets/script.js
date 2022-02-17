let gbreserva = '';

async function load() {
  loadReserva();
  loadSala();
}

async function loadReserva() {
  $('.table tbody').empty();
  let reservas = await axios.get('http://localhost:3000/reservas');
  reservas = reservas.data;

  $.each(reservas, async function (i, dados) {
    let avatar = '';

    let participantes = await axios.get('http://localhost:3000/participantes_sala/' + dados.idreserva);
    participantes = participantes.data;
    for (const user of participantes) {
      avatar += `<img src="assets/images/${user.foto}" alt="${user.nome}">`;
    }

    let item =
      `<tr ondblclick='clickReserva(${dados.idreserva})'>
        <td>${dados.horario}</td>
        <td>${dados.termino}</td>
        <td>${dados.descricao}</td>
        <td class="avatar">
          ${avatar}
        </td>
        <td class="avatar">
          <div class="input-group-append" onclick="deleteReserva(${dados.idreserva})">
            <label class="input-group-text btndel"><i class="fas fa-trash-alt"></i></label>
          </div>
        </td>

      </tr>`;

    $('.table-reserva tbody').append(item);
  });

}

async function deleteReserva(idreserva) {
  await axios.get('http://localhost:3000/delete_reserva/' + idreserva);
  await axios.get('http://localhost:3000/delete_reserva_participantes/' + idreserva);
  alert('success', 'Reserva excluida com sucesso!');
  loadReserva();
}

function modalReserva() {
  $('#modal-reserva').modal('show')
}

async function clickReserva(id) {
  gbreserva = id;
  $('#btn-save').html('Salvar Alterações');
  $('#title-reserva').html('Edição de reserva');

  let dados = await axios.get('http://localhost:3000/reservas/' + id);
  dados = dados.data[0];

  $('#horario').val(dados.horario);
  $('#termino').val(dados.termino);
  $('#sala').val(dados.idsala);

  loadUsers(id)
  modalReserva();
}

async function loadSala() {
  $('#sala').empty();
  let salas = await axios.get('http://localhost:3000/salas');
  salas = salas.data;

  let divSala = '';
  for (const item of salas) {
    divSala += `<option value="${item.idsala}">${item.descricao}</option>`;
  }

  $('#sala').append(divSala);
}

function novaSala() {
  $('#modal-reserva').modal('hide');
  $('#descricao-sala').val('');
  $('#modal-sala').modal('show');
  $('#descricao-sala').focus();
}

function closeSala() {
  $('#modal-sala').modal('hide');
  $('#modal-reserva').modal('show');
}

async function saveSala() {
  if (!$('#descricao-sala').val()) alert('error', 'Digite todos os campos!');
  else {

    await axios.get('http://localhost:3000/nova_sala/' + $('#descricao-sala').val());
    let dados = await axios.get('http://localhost:3000/ultima_sala');
    dados = dados.data[0];

    loadSala();
    alert('success', 'Salvo com sucesso');

    $('#sala').val(dados.idsala);
    $('#modal-sala').modal('hide');
    $('#modal-reserva').modal('show');
  }
}

function clickUser(el) {
  if ($(el).hasClass('select-tr')) $(el).removeClass('select-tr');
  else $(el).addClass('select-tr');

  const remove = $('.select-tr').length === 0 ? 'btn-warning' : 'btn-secondary';
  const add = $('.select-tr').length === 0 ? 'btn-secondary' : 'btn-warning';

  $('#btn-del-user').removeClass(remove);
  $('#btn-del-user').addClass(add);
}

async function delUser() {
  if ($('.select-tr').length == 0) {
    alert('error', 'Nenhum usuário selecionado!');
    return
  }

  let idDelete = '';
  $.each($('.select-tr'), (i, el) => {
    idDelete += el.id + ',';
  });
  idDelete = idDelete.slice(0, idDelete.length - 1);
  await axios.get('http://localhost:3000/delete_participantes/' + idDelete + '&' + gbreserva);

  loadUsers(gbreserva);
  $('#btn-del-user').removeClass('btn-warning');
  $('#btn-del-user').addClass('btn-secondary');
  alert('success', 'Usuário(s) deletado(s) com sucesso!');
}

async function loadUsers(id) {
  $('.table-reserva-user tbody').empty();

  let dados = await axios.get('http://localhost:3000/participantes_reserva/' + id);
  dados = dados.data;

  let divParticipante = '';
  for (const user of dados) {
    divParticipante += `
      <tr onclick="clickUser(this)" id='${user.idparticipante}'>
        <td>${user.nome}</td>
        <td class="avatar">
          <img src="assets/images/${user.foto}" alt="${user.nome}">
        </td>
      </tr>`;
  }
  $('.table-reserva-user tbody').append(divParticipante);
}

function novaUsuario() {
  loadNewUser();

  $('#modal-reserva').modal('hide');
  $('#modal-usuario').modal('show');
}

async function loadNewUser() {
  $('.table-select-user tbody').empty();
  let dados = await axios.get('http://localhost:3000/perticipantes_disponiveis/' + gbreserva);
  dados = dados.data;

  let divParticipante = '';
  for (const user of dados) {
    divParticipante += `
    <tr onclick="addUser(${user.idparticipante})" id='${user.idparticipante}'>
      <td>${user.nome}</td>
      <td class="avatar">
        <img src="assets/images/${user.foto}" alt="${user.nome}">
      </td>
    </tr>`;
  }

  $('.table-select-user tbody').append(divParticipante);
}

async function addUser(idparticipante) {
  await axios.get(`http://localhost:3000/novo_participante/${idparticipante}&${gbreserva}&${$('#sala').val()}`);
  alert('success', 'Salvo com sucesso');

  loadUsers(gbreserva);
  closeParceiro();
}

function closeParceiro() {
  $('#modal-usuario').modal('hide');
  $('#modal-reserva').modal('show');
}

async function salvarAlteracoes() {
  let horario = $('#horario').val();
  let termino = $('#termino').val();
  let idsala = $('#sala').val();
  await axios.get(`http://localhost:3000/update_reserva/${horario}&${termino}&${idsala}&${gbreserva}`);

  loadReserva();
  alert('success', 'Salvo com sucesso');
  $('#modal-reserva').modal('hide');
}

async function novaReserva() {
  await axios.get('http://localhost:3000/nova_reserva/');
  let dados = await axios.get('http://localhost:3000/ultima_reserva/');
  dados = dados.data[0];
  gbreserva = dados.idreserva;

  $('#horario').val('');
  $('#termino').val('');
  $('#sala').val(1);
  $('.table-reserva-user tbody').empty();
  $('#btn-save').html('Cadastrar');
  $('#title-reserva').html('Cadastro de reserva');
  $('#modal-reserva').modal('show');
}

function alert(param, descricao) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  Toast.fire({
    icon: param,
    title: descricao
  })
}

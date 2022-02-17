let dadosReservas = [
  {
    id: 1,
    horario: '11:30',
    termino: '20:00',
    idsala: 1,
    participantes: [1, 2],
    status: 'Atrasado'
  },
  {
    id: 2,
    horario: '01:15',
    termino: '11:00',
    idsala: 1,
    participantes: [1],
    status: 'Entregue'
  },
  {
    id: 3,
    horario: '09:30',
    termino: '15:00',
    idsala: 3,
    participantes: [3],
    status: 'Sem resposta'
  },
  {
    id: 4,
    horario: '20:30',
    termino: '01:00',
    idsala: 4,
    participantes: [1, 2, 3],
    status: 'Entregue'
  },
];

let dadosSala = [
  {
    id: 1,
    descricao: 'Sala 01',
  },
  {
    id: 2,
    descricao: 'Sala 02',
  },
  {
    id: 3,
    descricao: 'Sala 03',
  },
  {
    id: 4,
    descricao: 'Sala 04',
  },
]

let dadosParticipante = [
  {
    id: 1,
    nome: 'Inan Brunelli',
    foto: 'inan.jpg'
  },
  {
    id: 2,
    nome: 'Victor Gomes',
    foto: 'victor.jpg'
  },
  {
    id: 3,
    nome: 'Marcos Macedo',
    foto: 'marcos.jpg'
  },
]

let gbreserva = '';

function load() {
  //modalReserva();
  loadReserva();
  loadSala();
}

function loadReserva() {
  $('.table tbody').empty();
  $.each(dadosReservas, (i, dados) => {
    let avatar = '';
    for (const user of dados.participantes) {
      let select = dadosParticipante.find(item => item.id === user);
      avatar += `<img src="assets/images/${select.foto}" alt="${select.nome}">`;
    }
    const badge = dados.status == 'Entregue' ? 'success' : dados.status == 'Atrasado' ? 'danger' : 'warning';
    const sala = dadosSala.find(item => item.id === dados.idsala);

    let item =
      `<tr onclick='clickReserva(${dados.id})'>
        <td>${dados.horario}</td>
        <td>${dados.termino}</td>
        <td>${sala.descricao}</td>
        <td class="avatar">
          ${avatar}
        </td>
        <td><span class="badge badge-${badge}">${dados.status}</span></td>
      </tr>`;

    $('.table-reserva tbody').append(item);
  });

}

function modalReserva() {
  $('#modal-reserva').modal('show')
}

function clickReserva(id) {
  gbreserva = id;
  $('#btn-save').html('Salvar Alterações');
  let dados = dadosReservas.find(item => item.id === id);
  $('#horario').val(dados.horario);
  $('#termino').val(dados.termino);
  $('#termino').val(dados.termino);
  $('#sala').val(dados.idsala);

  loadUsers(id)
  modalReserva();
}

function loadSala() {
  $('#sala').empty();
  let divSala = '';
  for (const item of dadosSala) {
    divSala += `<option value="${item.id}">${item.descricao}</option>`;
  }

  $('#sala').append(divSala);
}

function newSala() {
  $('#modal-reserva').modal('hide');
  $('#descricao-sala').val('');
  $('#modal-sala').modal('show');
  $('#descricao-sala').focus();
}

function closeSala() {
  $('#modal-sala').modal('hide');
  $('#modal-reserva').modal('show');
}

function saveSala() {
  if (!$('#descricao-sala').val()) alert('error', 'Digite todos os campos!');
  else {
    let objSala = {
      descricao: $('#descricao-sala').val(),
      id: dadosSala[dadosSala.length - 1].id + 1
    }
    dadosSala.push(objSala);
    loadSala();
    alert('success', 'Salvo com sucesso');

    $('#sala').val(objSala.id);
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

function delUser() {
  if ($('.select-tr').length == 0) {
    alert('error', 'Nenhum usuário selecionado!');
    return
  }

  let newUsers = dadosReservas.find(item => item.id == gbreserva).participantes;
  $.each($('.select-tr'), (i, el) => {
    newUsers = newUsers.filter(item => item != el.id);
  });
  dadosReservas.find(item => item.id == gbreserva).participantes = newUsers;

  loadUsers(gbreserva);
  $('#btn-del-user').removeClass('btn-warning');
  $('#btn-del-user').addClass('btn-secondary');
  alert('success', 'Usuário(s) deletado(s) com sucesso!');
}

function loadUsers(id) {
  $('.table-reserva-user tbody').empty();
  let dados = dadosReservas.find(item => item.id === id);
  let divParticipante = '';
  for (const user of dados.participantes) {
    let select = dadosParticipante.find(item => item.id === user);
    divParticipante += `
      <tr onclick="clickUser(this)" id='${select.id}'>
        <td>${select.nome}</td>
        <td class="avatar">
          <img src="assets/images/${select.foto}" alt="${select.nome}">
        </td>
      </tr>`;
  }
  $('.table-reserva-user tbody').append(divParticipante);
}

function newUsuario() {
  loadNewUser();

  $('#modal-reserva').modal('hide');
  $('#modal-usuario').modal('show');
}

function loadNewUser() {
  $('.table-select-user tbody').empty();
  let usersReserva = dadosReservas.find(item => item.id === gbreserva);
  usersReserva = usersReserva.participantes;

  let divParticipante = '';
  for (const user of dadosParticipante) {
    let find = usersReserva.indexOf(user.id);
    if (find != 0) {
      console.log(user.nome)
      divParticipante += `
      <tr onclick="clickUser(this)" id='${user.id}'>
        <td>${user.nome}</td>
        <td class="avatar">
          <img src="assets/images/${user.foto}" alt="${user.nome}">
        </td>
      </tr>`;
    }
  }

  $('.table-select-user tbody').append(divParticipante);
}

function salvarAlteracoes() {
  let posicao = dadosReservas.find(item => item.id === gbreserva);

  let bingo = {
    id: posicao.id,
    horario: $('#horario').val(),
    termino: $('#termino').val(),
    idsala: Number($('#sala').val()),
    participantes: posicao.participantes,
    status: posicao.status
  }

  dadosReservas[posicao.id - 1] = bingo;
  loadReserva();
  $('#modal-reserva').modal('hide');
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

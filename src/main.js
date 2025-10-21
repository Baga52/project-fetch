let allData = null;
let currentUserId = null; // null = показывать всех

// Загружаем данные
fetch('db.json')
  .then(res => res.json())
  .then(data => {
    allData = data;
    renderMenu();
    renderPosts();
  })
  .catch(err => {
    document.getElementById('posts').innerHTML = '<p>Ошибка загрузки данных.</p>';
  });

// --- Меню авторов ---
function renderMenu() {
  const menu = document.getElementById('menu');
  let html = '<button onclick="filterPosts(null)" class="active">Все</button>';

  allData.users.forEach(user => {
    html += `<button onclick="filterPosts(${user.id})">${user.name}</button>`;
  });

  menu.innerHTML = html;
}

// Фильтрация
function filterPosts(userId) {
  currentUserId = userId;
  renderPosts();

  // Обновляем активную кнопку
  document.querySelectorAll('#menu button').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = userId === null
    ? document.querySelector('#menu button:first-child')
    : document.querySelector(`#menu button[onclick="filterPosts(${userId})"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

// --- Рендер постов ---
function renderPosts() {
  const container = document.getElementById('posts');
  container.innerHTML = '';

  let postsToShow = currentUserId
    ? allData.posts.filter(p => p.userId === currentUserId)
    : allData.posts;

  if (postsToShow.length === 0) {
    container.innerHTML = '<p>Нет постов.</p>';
    return;
  }

  postsToShow.forEach(post => {
    // Делаем краткое описание
    let short = post.body.replace(/\n/g, ' ');
    if (short.length > 100) {
      short = short.substring(0, 100) + '...';
    }

    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <h2>${post.title}</h2>
      <div class="post-content">${short}</div>
      <button class="btn" onclick="showModal(${post.id})">Подробнее</button>
    `;
    container.appendChild(div);
  });
}

// --- Модальное окно ---
function showModal(postId) {
  const post = allData.posts.find(p => p.id === postId);
  const comments = allData.comments.filter(c => c.postId === postId);

  if (!post) return;

  document.getElementById('modal-title').textContent = post.title;
  document.getElementById('modal-body').innerHTML = post.body.replace(/\n/g, '<br>');

  const commentsDiv = document.getElementById('comments-list');
  if (comments.length === 0) {
    commentsDiv.innerHTML = '<p>Комментариев нет.</p>';
  } else {
    let html = '';
    comments.forEach(c => {
      html += `
        <div class="comment">
          <strong>${c.name}</strong> — <em>${c.email}</em>
          <p>${c.body.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    });
    commentsDiv.innerHTML = html;
  }

  document.getElementById('modal').style.display = 'flex';

  // Закрытие
  document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = 'none';
  };
  window.onclick = (e) => {
    if (e.target.id === 'modal') {
      document.getElementById('modal').style.display = 'none';
    }
  };
}
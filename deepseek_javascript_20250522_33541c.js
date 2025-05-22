document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('yourFormId');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (typeof window.fetch === 'function') {
                // AJAX отправка
                const formData = new FormData(form);
                const jsonData = {};
                
                formData.forEach((value, key) => {
                    jsonData[key] = value;
                });
                
                fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('authToken') ? `Bearer ${localStorage.getItem('authToken')}` : undefined
                    },
                    body: JSON.stringify(jsonData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.profileUrl) {
                        // Сохраняем токен для авторизованных пользователей
                        if (data.token) {
                            localStorage.setItem('authToken', data.token);
                        }
                        // Показываем сообщение об успехе
                        showSuccessMessage(data);
                    }
                })
                .catch(error => {
                    showErrorMessage(error.message);
                });
            } else {
                // Стандартная отправка формы
                form.submit();
            }
        });
    }
});

function showSuccessMessage(data) {
    // Реализация показа сообщения об успехе
    alert(`Success! Profile URL: ${data.profileUrl}`);
}

function showErrorMessage(message) {
    // Реализация показа сообщения об ошибке
    alert(`Error: ${message}`);
}
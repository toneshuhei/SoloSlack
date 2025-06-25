// SoloSlack フロントエンド JavaScript

class SoloSlack {
    constructor() {
        this.currentTag = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPosts();
    }

    bindEvents() {
        // フォーム送信イベント
        const form = document.getElementById('postForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // フィルタボタンイベント
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    async loadPosts(tag = null) {
        try {
            const postsArea = document.getElementById('postsArea');
            postsArea.innerHTML = '<div class="loading">投稿を読み込み中...</div>';

            const url = tag ? `/api/posts?tag=${encodeURIComponent(tag)}` : '/api/posts';
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('投稿の取得に失敗しました');
            }

            const data = await response.json();
            this.renderPosts(data.posts);
        } catch (error) {
            console.error('投稿読み込みエラー:', error);
            this.showError('投稿の読み込みに失敗しました');
        }
    }

    renderPosts(posts) {
        const postsArea = document.getElementById('postsArea');
        
        if (posts.length === 0) {
            postsArea.innerHTML = '<div class="loading">投稿がありません</div>';
            return;
        }

        // 古い順に並べる（新しい投稿が下）
        const postsHTML = posts.slice().reverse().map(post => this.createPostHTML(post)).join('');
        postsArea.innerHTML = postsHTML;

        // レイアウト確定後に最下部までスクロール
        requestAnimationFrame(() => {
            postsArea.scrollTop = postsArea.scrollHeight;
            setTimeout(() => {
                postsArea.scrollTop = postsArea.scrollHeight;
            }, 50);
        });
    }

    createPostHTML(post) {
        const date = new Date(post.created_at).toLocaleString('ja-JP');
        const tagHTML = post.tag ? `<span class="post-tag">${this.escapeHtml(post.tag)}</span>` : '';
        return `
            <div class="post">
                <div class="post-header">
                    <span class="post-time">${date}</span>
                    ${tagHTML}
                </div>
                <div class="post-content">${this.escapeHtml(post.content)}</div>
            </div>
        `;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        try {
            // 送信ボタンを無効化
            submitBtn.disabled = true;
            submitBtn.textContent = '送信中...';

            const formData = new FormData(form);
            const postData = {
                content: formData.get('content').trim(),
                tag: formData.get('tag').trim() || null
            };

            // バリデーション
            if (!postData.content || !postData.tag) {
                throw new Error('内容とタグは必須です');
            }

            const response = await fetch('/api/posts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error('投稿の保存に失敗しました');
            }

            // 内容のみクリア（タグはそのまま）
            const contentInput = form.querySelector('#content');
            contentInput.value = '';
            
            // 投稿一覧を更新
            await this.loadPosts(this.currentTag);
            
            this.showSuccess('投稿が保存されました');
        } catch (error) {
            console.error('投稿エラー:', error);
            this.showError(error.message);
        } finally {
            // 送信ボタンを復活
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    handleFilter(e) {
        const button = e.target;
        const tag = button.dataset.tag;
        
        // アクティブボタンを更新
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // 投稿をフィルタ
        this.currentTag = tag;
        this.loadPosts(tag);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        const postsArea = document.getElementById('postsArea');
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;
        
        // 最新の投稿の下（末尾）に表示
        postsArea.appendChild(messageDiv);
        
        // メッセージ表示後に最下部までスクロール
        setTimeout(() => {
            postsArea.scrollTop = postsArea.scrollHeight;
        }, 0);
        
        // 3秒後にメッセージを削除
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new SoloSlack();

    // タグボタンの選択処理
    const tagButtons = document.querySelectorAll('.tag-btn');
    const tagInput = document.getElementById('tag');
    tagButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tagButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            tagInput.value = this.dataset.tag;
        });
    });

    // Ctrl+Enterで投稿
    const textarea = document.getElementById('content');
    const postForm = document.getElementById('postForm');
    textarea.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            postForm.requestSubmit();
        }
    });
}); 
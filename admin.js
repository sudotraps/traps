<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Blog</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container-fluid main-wrapper">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-lg-10 col-xl-8">
                
                <div class="auth-panel" id="authPanel">
                    <div class="auth-container">
                        <h3>🔒 Panel de Administración</h3>
                        <p>Ingresa tu contraseña para gestionar el blog</p>
                        <input 
                            type="password" 
                            id="adminPassword" 
                            class="form-control-custom" 
                            placeholder="Contraseña..."
                            onkeypress="if(event.key === 'Enter') checkPassword()"
                        >
                        <button class="btn-login" onclick="checkPassword()">
                            <i class="fas fa-sign-in-alt"></i>
                            Iniciar Sesión
                        </button>
                        <a href="/" class="btn-back">
                            <i class="fas fa-arrow-left"></i>
                            Volver al sitio público
                        </a>
                    </div>
                </div>

                <div class="admin-panel" id="adminPanel" style="display: none;">
                    <div class="blog-section">
                        <div class="blog-header">
                            <h2 class="blog-title">
                                <i class="fas fa-shield-alt"></i>
                                Panel de Administración
                            </h2>
                            <div class="header-actions">
                                <button class="btn-new-post" id="btnNewPost">
                                    <i class="fas fa-plus"></i>
                                    Nueva Publicación
                                </button>
                                <a href="/" class="btn-view-public">
                                    <i class="fas fa-eye"></i>
                                    Ver Sitio
                                </a>
                                <button class="btn-logout" onclick="logout()">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>

                        <div class="post-form" id="postForm" style="display: none;">
                            <div class="form-header">
                                <h3>✍️ Crear Nueva Publicación</h3>
                                <button class="btn-close-form" id="btnCloseForm">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <input 
                                type="text" 
                                id="postTitle" 
                                class="form-control-custom" 
                                placeholder="Título del post..."
                                maxlength="100"
                            >
                            <select id="postCategory" class="form-control-custom">
                                <option value="desarrollo">💻 Desarrollo</option>
                                <option value="gaming">🎮 Gaming</option>
                                <option value="aprendizaje">📚 Aprendizaje</option>
                                <option value="proyectos">🚀 Proyectos</option>
                                <option value="personal">✨ Personal</option>
                            </select>
                            <textarea 
                                id="postContent" 
                                class="form-control-custom" 
                                placeholder="Escribe tu contenido aquí..."
                                rows="6"
                            ></textarea>
                            
                            <div class="image-upload-section">
                                <label class="image-upload-label">
                                    <i class="fas fa-image"></i>
                                    Agregar Imagen 16:9 (Opcional)
                                    <input 
                                        type="file" 
                                        id="postImage" 
                                        accept="image/*"
                                        style="display: none;"
                                    >
                                </label>
                                <div id="imagePreview" class="image-preview" style="display: none;">
                                    <img id="previewImg" src="" alt="Preview">
                                    <button class="btn-remove-image" id="btnRemoveImage" type="button">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button class="btn-cancel" id="btnCancel">Cancelar</button>
                                <button class="btn-publish" id="btnPublish">
                                    <i class="fas fa-paper-plane"></i>
                                    Publicar
                                </button>
                            </div>
                        </div>

                        <div class="posts-container" id="postsContainer"></div>

                        <div class="empty-blog" id="emptyBlog">
                            <i class="fas fa-pen-fancy"></i>
                            <p>Aún no hay publicaciones</p>
                            <p class="empty-subtitle">¡Crea tu primera publicación!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Supabase SDK -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="config.js"></script>
    <script src="admin.js"></script>
</body>
</html>

import { useState } from 'react';
import './ImageUpload.css';

function ImageUpload({ onImageUploaded, currentImage }) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentImage || '');
    const [error, setError] = useState('');

    // ✅ Leer desde variables de entorno
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'perfumeria_capri';
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dypnyi24b';

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar que sea imagen
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecciona una imagen válida');
            return;
        }

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen no debe superar los 5MB');
            return;
        }

        setError('');

        // Preview local mientras sube
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);

        // Subir a Cloudinary
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                onImageUploaded(data.secure_url);
                setPreviewUrl(data.secure_url);
                setError('');
                alert('✅ Imagen subida correctamente a Cloudinary');
            } else {
                throw new Error('No se recibió URL de Cloudinary');
            }
        } catch (err) {
            console.error('Error al subir imagen:', err);
            setError('Error al subir la imagen. Verifica tu configuración de Cloudinary.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-upload-container">
            <label className="upload-label">
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
                <div className={`upload-button ${uploading ? 'uploading' : ''}`}>
                    {uploading ? '⏳ Subiendo imagen...' : '📷 Seleccionar Imagen'}
                </div>
            </label>

            {error && <p className="upload-error">{error}</p>}

            {previewUrl && (
                <div className="image-preview">
                    <img src={previewUrl} alt="Preview del producto" />
                    <p className="image-hint">
                        {uploading ? 'Subiendo a Cloudinary...' : 'Vista previa de la imagen'}
                    </p>
                </div>
            )}

            {!previewUrl && !uploading && (
                <p className="upload-hint">
                    Formatos: JPG, PNG, WEBP | Tamaño máx: 5MB
                </p>
            )}
        </div>
    );
}

export default ImageUpload;
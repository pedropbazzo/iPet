import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import './styles.css';

interface Props {
    onImageLoaded : (file: File) => void;
}

const Dropzone: React.FC<Props> = ({onImageLoaded}) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState('')

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);
        onImageLoaded(file);

    }, [onImageLoaded])
    
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' })

    return (
        <div className="dropzone"{...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />

            { selectedFileUrl
                ? <img className="drop" src={selectedFileUrl} alt="Point thumbnail" />
                : <p>
                    <FiUpload />
                Clique para adicionar ou arraste a imagem do estabelecimento
            </p>
            }
        </div>
    )
}

export default Dropzone;
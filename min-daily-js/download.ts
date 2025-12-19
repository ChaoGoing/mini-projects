import { message } from 'antd'

interface FileItem extends Record<any, any> {
    link: string
    name: string
}
export async function download(files: FileItem[]) {
    try {
        if (files.length === 1) {
            // 单个文件直接下载
            const file = files[0]
            const link = document.createElement('a')
            link.href = file.link
            link.download = file.name || `file_${file.id}`
            link.target = '_blank'

            try {
                const response = await fetch(file.link)
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                link.href = url

                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                setTimeout(() => window.URL.revokeObjectURL(url), 100)
            } catch (error) {
                console.warn('Fetch failed, trying direct download:', error)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        } else {
            // 多个文件打包成 zip 下载
            const JSZip = (await import('jszip')).default
            const zip = new JSZip()

            message.loading('正在打包文件...', 0)

            // 并发下载所有文件
            const downloadPromises = files.map(async (file, index) => {
                try {
                    const response = await fetch(file.link)
                    const blob = await response.blob()
                    const fileName = file.name || `file_${index + 1}.${blob.type.split('/')[1] || 'bin'}`
                    zip.file(fileName, blob)
                } catch (error) {
                    console.error(`Failed to download file: ${file.name}`, error)
                }
            })

            await Promise.all(downloadPromises)

            // 生成 zip 文件
            const zipBlob = await zip.generateAsync({ type: 'blob' })
            const zipUrl = window.URL.createObjectURL(zipBlob)

            // 下载 zip 文件
            const link = document.createElement('a')
            link.href = zipUrl
            link.download = `素材文件_${new Date().getTime()}.zip`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // 清理资源
            setTimeout(() => window.URL.revokeObjectURL(zipUrl), 100)
            message.destroy()
        }
    } catch (error) {
        console.error('Download failed:', error)
        message.error('下载失败')
        message.destroy()
    }
}

/**
 * Convert a data URI to a File object with the correct MIME type.
 * @param dataUri - The data URI to convert.
 * @returns A File object representing the image.
 */
export const convertDataUriToFileImage = (dataUri: string): File => {
  const [mimeInfo, base64Data] = dataUri.split(',')
  const mimeString = mimeInfo.split(':')[1].split(';')[0]
  const byteString = atob(base64Data)
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([ia], { type: mimeString })
  const fileExtension = mimeString.split('/')[1]
  const convertedFile = new File([blob], `image.${fileExtension}`, { type: mimeString })

  return convertedFile
}

export default {
  convertDataUriToFileImage,
}

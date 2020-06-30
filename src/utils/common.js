import Compressor from 'compressorjs'

export const compressImg = (file, quality) => {
  return new Promise(async (resolve, reject) => {
    let _file = file
    new Compressor(_file, {
      quality: quality || 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      convertSize: 1000000,
      success: resolve,
      error: reject,
    })
  })
}
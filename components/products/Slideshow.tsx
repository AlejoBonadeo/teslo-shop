import { FC } from "react"
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'
import styles from './Slideshow.module.css'

interface Props {
    images: string[]
}

export const Slideshow: FC<Props> = ({images}) => {
  return (
    <Slide
      easing="ease"
      duration={7000}
      indicators
    >
      {
          images.map(image => {
              const url = image
              return (
                  <div key={ url}className={styles['each-slide']}>
                      <div style={{
                          backgroundImage: `url(${url})`,
                          backgroundSize: 'cover'
                      }}>

                      </div>
                  </div>
              )
          })
      }
    </Slide>
  )
}

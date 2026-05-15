import cx from './cx'
import styles from './buttons.module.css'
import Button from './Button'

function FloatingButton({ className, ...props }) {
    return (
        <Button className={cx(
                  styles.button_floating,
                  className
                )}
                {...props} />
    
    )
}

export { FloatingButton as default, FloatingButton }
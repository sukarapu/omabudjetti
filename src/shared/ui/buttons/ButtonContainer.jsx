import cx from './cx'
import styles from './buttons.module.css'

function ButtonContainer({className, children, ...props}) {
    return (
        <div className={cx(
                styles.button_container,
                className
               )}
               {...props} >
            { children }
        </div>
    )
}

export { ButtonContainer as default, ButtonContainer }
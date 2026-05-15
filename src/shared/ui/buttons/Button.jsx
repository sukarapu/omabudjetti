import styles from './buttons.module.css'
import cx from './cx'

function Button({className, primary, secondary, warning, ...props}) {
    return (
        <button type='button' 
                className={cx(
                    styles.button, 
                    className, 
                    primary && styles.button_primary,
                    secondary && styles.button_secondary,
                    warning && styles.button_warning
                )} 
                {...props} />
    )
}

export { Button as default, Button }
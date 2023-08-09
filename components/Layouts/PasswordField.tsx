import {
    FormControl,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputProps,
    InputRightElement,
    useDisclosure,
    useMergeRefs,
} from '@chakra-ui/react'
import { forwardRef, useRef } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export const PasswordField = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { isOpen, onToggle } = useDisclosure()
    const inputRef = useRef<HTMLInputElement>(null)

    const mergeRef = useMergeRefs(inputRef, ref)
    const onClickReveal = () => {
        onToggle()
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true })
        }
    }

    return (
        <FormControl>
            <FormLabel htmlFor="password">Contraseña</FormLabel>
            <InputGroup>
                <InputRightElement>
                    <IconButton
                        variant="text"
                        aria-label={isOpen ? 'Mask password' : 'Reveal password'}
                        icon={isOpen ? <ViewIcon /> : <ViewOffIcon />}
                        onClick={onClickReveal}
                    />
                </InputRightElement>
                <Input
                    id="password"
                    ref={mergeRef}
                    name="password"
                    type={isOpen ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    {...props}
                />
            </InputGroup>
        </FormControl>
    )
})

PasswordField.displayName = 'PasswordField'
const toCamelCase = (str) => {
  str = str.charAt(0).toUpperCase() + str.slice(1)
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

const getComponentTemp = (name, nameCC, widthStyles = true) => {
  return `${widthStyles ? "import * as S from './" + name + ".styles'" : ''}

type Props = {

}


const ${nameCC}: React.FC<Props> = () => {
  return (
    <S.Container >

    </S.Container>
  )
}

export default ${nameCC}
`
}

const getContainerTemp = (name, nameCC) => {
  return `import { useSelector } from 'react-redux'

import ${nameCC} from './${name}.component'



const ${nameCC}Container: React.FC = ({ ...props }: any) => {
  return (
    <${nameCC} {...props} >

    </${nameCC}>
  )
}

export default ${nameCC}Container
`
}

const getStyleTemp = (name, nameCC) => {
  return `import styled from 'styled-components'

export const Container = styled.div${'`' + '`'}
`
}

module.exports = {
  tasks: [
    {
      command: 'a component ...flags',
      run: async ({ _component, _flags, log, createFolder, createFile, openFiles }) => {
        const _componentCC = toCamelCase(_component)

        try {
          const dir = await createFolder(`./src/components/${_component}`)
          const filesToOpen = []
          const file = await createFile(
            `${dir}/${_component}.component.tsx`,
            getComponentTemp(_component, _componentCC, !_flags.includes('--no-style'))
          )
          log(`✅ ${_component}.component.tsx successfully added!`, 'green')
          filesToOpen.push(file)

          let style
          let container

          if (!_flags.includes('--no-style')) {
            style = await createFile(
              `${dir}/${_component}.styles.tsx`,
              getStyleTemp(_component, _componentCC)
            )
            log(`✅ ${_component}.styles.tsx successfully added!`, 'green')
            filesToOpen.push(style)
          }

          if (_flags.includes('--with-container')) {
            container = await createFile(
              `${dir}/${_component}.container.tsx`,
              getContainerTemp(_component, _componentCC)
            )
            log(`✅ ${_component}.container.tsx successfully added!`, 'green')
            filesToOpen.push(container)
          }

          if (_flags.includes('--open')) {
            await openFiles([filesToOpen[0]])
          }

          if (_flags.includes('--open-all')) {
            await openFiles(filesToOpen)
          }
        } catch (err) {
          log(err.message, 'red')
        }
      }
    }
  ]
}

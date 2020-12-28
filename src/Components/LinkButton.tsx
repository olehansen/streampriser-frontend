import * as  React from 'react';
import * as classNames from 'classnames';
import './LinkButton.scss'

interface ILinkButtonProps {
    href: string,
    target: string
}

interface ILinkButtonState {

}

export class LinkButton extends React.Component<ILinkButtonProps, ILinkButtonState> {

    constructor(props: ILinkButtonProps) {
        super(props);
    }

    render() {
        const { href, target } = this.props;
        return <a className="streamhubjs-button" href={href} target={target} >
            {this.props.children}
        </a>;
    }
}
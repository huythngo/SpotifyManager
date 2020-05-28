import React from 'react'

export class ButtonLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

        }
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    handleOnClick() {
        this.setState({ loading: true });
        setTimeout(() => {
            this.props.onSave();
            this.setState({ loading: false })
        }, 1000)


    }

    render() {
        return (
            <button
                className={this.props.classNameProp}
                onClick={this.handleOnClick}
            >
                {this.state.loading && <span>{this.props.loadingText} <i className="fa fa-refresh fa-spin"></i></span>}

                {!this.state.loading && <span>{this.props.defaultText}</span>}
            </button>
        );
    }
}
import React from 'react';
import PropTypes from 'prop-types';
import { _window } from '../util';

const _document = _window.document ? _window.document : {};

function Pane(props: Record<string, any>) {
    const size = props.size || 0;
    const unit = props.percentage ? '%' : 'px';
    let classes = 'layout-pane';
    const style: Record<string, any> = {};
    if (!props.primary) {
        if (props.vertical) {
            style.height = `${size}${unit}`;
        } else {
            style.width = `${size}${unit}`;
        }
    } else {
        classes += ' layout-pane-primary';
    }
    return (
        <div className={classes} style={style}>{props.children}</div>
    );
}

Pane.propTypes = {
    vertical: PropTypes.bool,
    primary: PropTypes.bool,
    size: PropTypes.number,
    percentage: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

Pane.defaultProps = {
    vertical: false,
    primary: false,
    size: 0,
    percentage: false,
    children: []
};

function clearSelection() {
    if (_document.body.createTextRange) {
        // https://github.com/zesik/react-splitter-layout/issues/16
        // https://stackoverflow.com/questions/22914075/#37580789
        const range = _document.body.createTextRange();
        range.collapse();
        range.select();
    } else if (_window.getSelection) {
        if (_window.getSelection().empty) {
            _window.getSelection().empty();
        } else if (_window.getSelection().removeAllRanges) {
            _window.getSelection().removeAllRanges();
        }
    } else if (_document.selection) {
        _document.selection.empty();
    }
}

const DEFAULT_SPLITTER_SIZE = 4;

class SplitterLayout extends React.Component<Record<string, any>, Record<string, any>> {

    private splitter: any = React.createRef<HTMLDivElement>()
    private container: any = React.createRef<HTMLDivElement>()

    constructor(props: Record<string, any>) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleSplitterMouseDown = this.handleSplitterMouseDown.bind(this);
        this.state = {
            secondaryPaneSize: 0,
            resizing: false
        };
    }

    componentDidMount() {
        _window.addEventListener('resize', this.handleResize);
        _document.addEventListener('mouseup', this.handleMouseUp);
        _document.addEventListener('mousemove', this.handleMouseMove);
        _document.addEventListener('touchend', this.handleMouseUp);
        _document.addEventListener('touchmove', this.handleTouchMove);

        let secondaryPaneSize;
        if (typeof this.props.secondaryInitialSize !== 'undefined') {
            secondaryPaneSize = this.props.secondaryInitialSize;
        } else {
            const containerRect = this.container.current.getBoundingClientRect();
            let splitterRect;
            if (this.splitter?.current) {
                splitterRect = this.splitter.current.getBoundingClientRect();
            } else {
                // Simulate a splitter
                splitterRect = { width: DEFAULT_SPLITTER_SIZE, height: DEFAULT_SPLITTER_SIZE };
            }
            secondaryPaneSize = this.getSecondaryPaneSize(containerRect, splitterRect, {
                left: containerRect.left + ((containerRect.width - splitterRect.width) / 2),
                top: containerRect.top + ((containerRect.height - splitterRect.height) / 2)
            }, false);
        }
        this.setState({ secondaryPaneSize });
    }

    componentDidUpdate(prevProps: Record<string, any>, prevState: Record<string, any>) {

        if (prevProps) prevState;

        if (prevState.secondaryPaneSize !== this.state.secondaryPaneSize && this.props.onSecondaryPaneSizeChange) {
            this.props.onSecondaryPaneSizeChange(this.state.secondaryPaneSize);
        }
        if (prevState.resizing !== this.state.resizing) {
            if (this.state.resizing) {
                if (this.props.onDragStart) {
                    this.props.onDragStart();
                }
            } else if (this.props.onDragEnd) {
                this.props.onDragEnd();
            }
        }
    }

    componentWillUnmount() {
        _window.removeEventListener('resize', this.handleResize);
        _document.removeEventListener('mouseup', this.handleMouseUp);
        _document.removeEventListener('mousemove', this.handleMouseMove);
        _document.removeEventListener('touchend', this.handleMouseUp);
        _document.removeEventListener('touchmove', this.handleTouchMove);
    }

    getSecondaryPaneSize(containerRect: Record<string, any>, splitterRect: Record<string, any>, clientPosition: Record<string, any>, offsetMouse: boolean) {
        let totalSize;
        let splitterSize;
        let offset;
        if (this.props.vertical) {
            totalSize = containerRect.height;
            splitterSize = splitterRect.height;
            offset = clientPosition.top - containerRect.top;
        } else {
            totalSize = containerRect.width;
            splitterSize = splitterRect.width;
            offset = clientPosition.left - containerRect.left;
        }
        if (offsetMouse) {
            offset -= splitterSize / 2;
        }
        if (offset < 0) {
            offset = 0;
        } else if (offset > totalSize - splitterSize) {
            offset = totalSize - splitterSize;
        }

        let secondaryPaneSize;
        if (this.props.primaryIndex === 1) {
            secondaryPaneSize = offset;
        } else {
            secondaryPaneSize = totalSize - splitterSize - offset;
        }
        let primaryPaneSize = totalSize - splitterSize - secondaryPaneSize;
        if (this.props.percentage) {
            secondaryPaneSize = (secondaryPaneSize * 100) / totalSize;
            primaryPaneSize = (primaryPaneSize * 100) / totalSize;
            splitterSize = (splitterSize * 100) / totalSize;
            totalSize = 100;
        }

        if (primaryPaneSize < this.props.primaryMinSize) {
            secondaryPaneSize = Math.max(secondaryPaneSize - (this.props.primaryMinSize - primaryPaneSize), 0);
        } else if (secondaryPaneSize < this.props.secondaryMinSize) {
            secondaryPaneSize = Math.min(totalSize - splitterSize - this.props.primaryMinSize, this.props.secondaryMinSize);
        }

        return secondaryPaneSize;
    }

    handleResize() {
        if (this.splitter.current && !this.props.percentage) {
            const containerRect = this.container.current.getBoundingClientRect();
            const splitterRect = this.splitter.current.getBoundingClientRect();
            const secondaryPaneSize = this.getSecondaryPaneSize(containerRect, splitterRect, {
                left: splitterRect.left,
                top: splitterRect.top
            }, false);
            this.setState({ secondaryPaneSize });
        }
    }

    handleMouseMove(e: any) {
        if (this.state.resizing) {
            const containerRect = this.container.current.getBoundingClientRect();
            const splitterRect = this.splitter.current.getBoundingClientRect();
            const secondaryPaneSize = this.getSecondaryPaneSize(containerRect, splitterRect, {
                left: e.clientX,
                top: e.clientY
            }, true);
            clearSelection();
            this.setState({ secondaryPaneSize });
        }
    }

    handleTouchMove(e: any) {
        this.handleMouseMove(e.changedTouches[0]);
    }

    handleSplitterMouseDown() {
        clearSelection();
        this.setState({ resizing: true });
    }

    handleMouseUp() {
        this.setState(prevState => (prevState.resizing ? { resizing: false } : null));
    }

    render() {
        let containerClasses = 'splitter-layout';
        if (this.props.customClassName) {
            containerClasses += ` ${this.props.customClassName}`;
        }
        if (this.props.vertical) {
            containerClasses += ' splitter-layout-vertical';
        }
        if (this.state.resizing) {
            containerClasses += ' layout-changing';
        }

        const children = React.Children.toArray(this.props.children).slice(0, 2);
        if (children.length === 0) {
            children.push(<div />);
        }
        const wrappedChildren = [];
        const primaryIndex = (this.props.primaryIndex !== 0 && this.props.primaryIndex !== 1) ? 0 : this.props.primaryIndex;
        for (let i = 0; i < children.length; ++i) {
            let primary = true;
            let size = null;
            if (children.length > 1 && i !== primaryIndex) {
                primary = false;
                size = this.state.secondaryPaneSize;
            }
            wrappedChildren.push(
                <Pane vertical={this.props.vertical} percentage={this.props.percentage} primary={primary} size={size}>
                    {children[i]}
                </Pane>
            );
        }

        return (
            <div className={containerClasses} ref={this.container}>
                {wrappedChildren[0]}
                {wrappedChildren.length > 1 &&
                    (
                        <div
                            role="separator"
                            className="layout-splitter"
                            ref={this.splitter}
                            onMouseDown={this.handleSplitterMouseDown}
                            onTouchStart={this.handleSplitterMouseDown}
                        />
                    )
                }
                {wrappedChildren.length > 1 && wrappedChildren[1]}
            </div>
        );
    }
}

export default SplitterLayout;
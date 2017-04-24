import React, { Component } from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import { Seq } from 'immutable';
import { Icon } from 'react-materialize';

import './SortableComponent.css';

const SortableItem = SortableElement(({value}) =>
  <li className="c-sortable-component__item"><Icon>menu</Icon><span>{value.name}</span></li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul className="c-sortable-component">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class SortableComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: Seq.isSeq(this.props.items) ? this.props.items.toJS() : this.props.items,
    };
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  render() {
    return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}

export default SortableComponent;

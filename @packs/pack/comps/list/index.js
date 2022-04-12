import React from 'react'
import { Actheme } from '../../theme'

const Styled = Actheme.create({

  List: ['FlatList', ['f:1', {
    contentContainerStyle: Actheme.style('xw:s300 as:c ai,jc:c pt:s66 pb:s22.5'),
    columnWrapperStyle: Actheme.style('fw:wrap ai,jc:c')}]],
  Wrap: ['View', 'as:c bw:1 bc:grey br:s5 bg:white of:hd mt:s2.5 w:90vw nh,xw:s95'],

  Comp: (props) => {

    const {
      data,
      item,
      onScroll,
      navigation,
      placeholder } = props

    return (
      <Styled.List 
        data={data}
        renderItem={item}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Styled.Wrap>{placeholder}</Styled.Wrap>}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={6}
        onScroll={onScroll}
        scrollEventThrottle={1}
        numColumns={6}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={navigation}
      />
    )
  }
})

export default Styled.Comp
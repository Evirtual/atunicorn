import React from 'react'
import { Actheme } from '../../theme'

const Styled = Actheme.create({

  List: ['RefFlatList', ['f:1', {
    contentContainerStyle: Actheme.style('xw:s300 as:ctr ai,jc:ctr pt:s66 pb:s22.5'),
    columnWrapperStyle: Actheme.style('fw:wrap ai,jc:ctr')}]],
  Wrap: ['View', 'as:ctr bw:1 bc:grey br:s5 bg:white of:hd mt:s2.5 w:90vw nh,xw:s95'],

  Comp: (props) => {

    const {
      ref,
      data,
      item,
      onScroll,
      navigation,
      placeholder,
      scrollToIndex } = props

    return (
      <Styled.List 
        ref={ref}
        data={data}
        renderItem={item}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Styled.Wrap>{placeholder}</Styled.Wrap>}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={6}
        onScroll={onScroll}
        scrollToIndex={scrollToIndex}
        scrollEventThrottle={1}
        numColumns={6}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={navigation}
      />
    )
  }
})

export default Styled.Comp
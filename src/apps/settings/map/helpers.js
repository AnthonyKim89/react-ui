function parseLatLng( input ) {
  if (!input || input.length<1) {
    return [];
  }

  if( input.indexOf( 'N' ) === -1 && input.indexOf( 'S' ) === -1 &&
      input.indexOf( 'W' ) === -1 && input.indexOf( 'E' ) === -1 ) {
      return input.split(',');
  }

  let parts = input.split(/[°'"]+/).join(' ').split(/[^\w\S]+/);
  let directions = [];
  let coords = [];
  let dd = 0;
  let pow = 0;

  for(let i in parts ) {

    // we end on a direction
    if( isNaN( parts[i] ) ) {

        let _float = parseFloat( parts[i] );

        let direction = parts[i];

        if( !isNaN(_float ) ) {
            dd += ( _float / Math.pow( 60, pow++ ) );
            direction = parts[i].replace( _float, '' );
        }

        direction = direction[0];

        if( direction === 'S' || direction === 'W' )
            dd *= -1;

        directions[ directions.length ] = direction;

        coords[ coords.length ] = dd;
        dd = pow = 0;

    } else {

        dd += ( parseFloat(parts[i]) / Math.pow( 60, pow++ ) );

    }

  }

  if( directions[0] === 'W' || directions[0] === 'E' ) {
      let tmp = coords[0];
      coords[0] = coords[1];
      coords[1] = tmp;
  }

  return coords;
}

export default parseLatLng;

function parseLatLng( input ) {
  if (!input || input.length<1) {
    return [];
  }

  if( input.indexOf( 'N' ) === -1 && input.indexOf( 'S' ) === -1 &&
      input.indexOf( 'W' ) === -1 && input.indexOf( 'E' ) === -1 ) {
      return input.split(',');
  }

  var parts = input.split(/[°'"]+/).join(' ').split(/[^\w\S]+/);
  var directions = [];
  var coords = [];
  var dd = 0;
  var pow = 0;

  for(var i in parts ) {

    // we end on a direction
    if( isNaN( parts[i] ) ) {

        var _float = parseFloat( parts[i] );

        var direction = parts[i];

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
      var tmp = coords[0];
      coords[0] = coords[1];
      coords[1] = tmp;
  }

  return coords;
}

export default parseLatLng
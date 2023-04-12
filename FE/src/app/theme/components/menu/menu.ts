import { Menu } from './menu.model';

export const horizontalMenuItems = [ 
    new Menu (1, 'Home', '/', null, null, false, 0),
    new Menu (2, 'Properties', '/properties', null, null, false, 0), 
    new Menu (40, 'Users', '/agents', null, null, false, 0),
    new Menu (60, 'Contact', '/contact', null, null, false, 0),  
    new Menu (70, 'About Us', '/about', null, null, false, 0),     
]

export const verticalMenuItems = [ 
    new Menu (1, 'Home', '/', null, null, false, 0), 
    new Menu (2, 'Properties', '/properties', null, null, false, 0), 
    new Menu (40, 'Users', '/agents', null, null, false, 0),
    new Menu (60, 'Contact', '/contact', null, null, false, 0),  
    new Menu (70, 'About Us', '/about', null, null, false, 0),   
]
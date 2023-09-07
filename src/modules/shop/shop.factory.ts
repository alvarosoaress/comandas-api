import { ShopController } from './shop.controller';
import { ShopRepository } from './shop.repository';
import { ShopService } from './shop.service';

export function shopFactory(): ShopController {
  const shopRepository = new ShopRepository();
  const shopService = new ShopService(shopRepository);
  const shopController = new ShopController(shopService);

  return shopController;
}
